#!/bin/bash
for i in {1..1}
do
curl -X DELETE "http://pers31.ub.uni-heidelberg.de:8080/rest/.well-known/genid"
curl -X DELETE "http://pers31.ub.uni-heidelberg.de:8080/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/$i"
curl -X PUT  "http://pers31.ub.uni-heidelberg.de:8080/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/$i"
curl -X PUT -H "Content-Type: text/turtle" --data-binary "@open_object.ttl" "http://pers31.ub.uni-heidelberg.de:8080/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/$i"   

#curl -X PUT  "http://serv21.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/$i"
#curl -X PUT -H "Content-Type: text/turtle" --data-binary "@open_object.ttl" "http://serv21.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/$i"   



done
