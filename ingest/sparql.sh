#!/bin/bash
for i in {1..1}
do
curl -X POST -H "application/x-turtle" -H "Content-Type:application/sparql-query" --data-binary "@sparql-query.txt" "http://localhost:8080/rest/fcr:sparql"
   
done
