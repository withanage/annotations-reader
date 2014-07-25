#!/bin/bash
for i in {1..1}
do
#curl -X POST -H "Content-Type: application/sparql-update" --data-binary "@object.rdf" "http://serv21.ub.uni-heidelberg.de:8080/fedora/rest/test" 
curl -X PUT  -H "Content-Type: application/sparql-update" --data-binary "@object.rdf" "http://serv21.ub.uni-heidelberg.de:8080/fedora/rest/test/de/uni-heidelbergde/ub/" 

   
done
