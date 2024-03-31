COPY PostRelation FROM 't_w-rinkaku\postrelation.csv' (FORMAT 'csv', header 1, delimiter ',', quote '"');
COPY Post FROM 't_w-rinkaku\post.csv' (FORMAT 'csv', header 1, delimiter ',', quote '"');
