import lance
import pandas as pd
import numpy as np
import random
from lance.vector import vec_to_table
import pyarrow as pa
import duckdb
import time

uri = "./test.lance"
size = 100_000
embedding_size = 768

def create(mode, size=size):
    lst = []
    for i in range(size):
        vector = np.array([(random.random() - 0.5) * 2 for j in range(embedding_size)])
        lst.append({"vector": vector, "order": random.random()})

    schema = pa.schema(
        [
            pa.field("vector", pa.list_(pa.float32(), embedding_size)),
            pa.field("order", pa.float32()),
        ]
    )
    tbl = pa.Table.from_pylist(lst, schema)
    
    lance.write_dataset(tbl, uri, mode=mode)

def query():
    dataset = lance.dataset(uri)
    t = time.time_ns()
    for i in range(1000):
        result = duckdb.query("SELECT dataset.vector FROM dataset ORDER BY dataset.order DESC LIMIT 100")
    print("query[ms]", (time.time_ns() - t) / 1000 / 1000_000)

def search():
    dataset = lance.dataset(uri)
    samples = duckdb.query("SELECT vector FROM dataset USING SAMPLE 1000").to_df().vector
    
    t = time.time_ns()
    for i in range(100):
        q = samples[i]
        result = dataset.to_table(nearest={
            "column": "vector", 
            "k": 100,
            "q": q,
        })
    print("search[ms]", (time.time_ns() - t) / 100 / 1000_000)
    # print(result)

def create_index():
    dataset = lance.dataset(uri)
    t = time.time_ns()
    
    dataset.create_index("vector",
                    index_type="IVF_PQ",
                    num_partitions=256,  # IVF
                    num_sub_vectors=16,  # PQ
                    replace=True,
                    )
    print("create index[ms]", (time.time_ns() - t) / 1000_000)

def single_table_search():
    create("overwrite", 10_000)
    query()
    search()
    create_index()
    query()
    search()

def time_duckdb():
    ddb = duckdb.connect("t_w-rinkaku.duckdb")
    c = 100
    
    posts = ddb.sql("SELECT * FROM Post")
    lance.write_dataset(posts.arrow(), "./posts.lance", mode="overwrite")
    relations = ddb.sql("SELECT * FROM PostRelation")
    lance.write_dataset(relations.arrow(), "./relations.lance", mode="overwrite")

    t = time.time_ns()
    for i in range(c):
        posts = ddb.execute("""
            SELECT 
                post.kno,
                post.title,
                post.body_html,
                post.posted_at,
                post.crawled_at,
                list([fg_post.title, fg_post.kno]) as fg_array,
                list([bg_post.title, bg_post.kno]) as bg_array,
            FROM (SELECT * FROM Post ORDER BY posted_at DESC LIMIT 100) as post
            LEFT JOIN PostRelation as rfg ON rfg.bg = post.kno
            LEFT JOIN PostRelation as rbg ON rbg.fg = post.kno
            LEFT JOIN Post as fg_post ON fg_post.kno = rfg.fg
            LEFT JOIN Post as bg_post ON bg_post.kno = rbg.bg
            GROUP BY (
                post.kno,
                post.title,
                post.body_html,
                post.posted_at,
                post.crawled_at
            )
        """).arrow()
    print("duckdb[ms]: ", (time.time_ns() - t) / 1_000_000 / c)

def duckdb_vs_lance():
    time_duckdb()

    c = 100

    posts_lance = lance.dataset("./duckdb.lance")
    relations_lance = lance.dataset("./relations.lance")
    
    t = time.time_ns()
    result = duckdb.query("""
        SELECT * FROM posts_lance;
    """).to_df()
    print((time.time_ns() - t) / c / 1_000_000)

def duckdb_vs_sqlite():
    ddb = duckdb.connect("t_w-rinkaku.duckdb")
    posts = ddb.sql("SELECT * FROM Post")
    lance.write_dataset(posts.arrow(), "./posts.lance", mode="overwrite")

    posts_lance = lance.dataset("./posts.lance")
    posts_lance.create_index("vector", index_type="IVF_PQ", num_partitions=256, num_sub_vectors=16, replace=True)

    posts_lance.to_sqlite("./posts.sqlite", "Post")

if __name__ == "__main__":
    duckdb_vs_lance()