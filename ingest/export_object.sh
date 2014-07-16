
#!/bin/bash

#text/turtle, text/rdf+n3, text/n3, application/rdf+xml, application/n-triples, text/html, text/plain
for i in {1..1}
do
#curl -H "Accept: application/n-triples" "http://serv21.ub.uni-heidelberg.de:8080/fedora/rest/	" > result.xml
curl "http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1755/0002/fcr:export?format=jcr/xml" > result.xml

   
done

