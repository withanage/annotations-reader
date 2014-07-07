#!/bin/bash
#curl -X DELETE "http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/.well-known/genid"

for i in {6..6}
do
curl -X DELETE "http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/$i"
#curl -X PUT  "http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001"
#curl -X PUT -H "Content-Type: text/turtle" --data-binary "@open_object_$i.ttl" "http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/$i"   

#curl -X PUT  "http://serv21.ub.uni-heidelberg.de:8080/fedora/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/$i"
#curl -X PUT -H "Content-Type: text/turtle" --data-binary "@open_object.ttl" "http://serv21.ub.uni-heidelberg.de:8080/fedora/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/1/$i"   
#curl -i -X PUT -H "Content-Type:text/plain" "http://localhost:8080/fedora/rest?mixin=fedora:datastream"


curl -X PUT -H "Content-Type: application/ld+json" --data-binary "@rdf.json" "http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/$i"   
done

