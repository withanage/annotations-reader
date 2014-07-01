#!/bin/bash
for i in {1..1}
do
curl  "http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/1/"  -H "Accept: application/ld+json "
#echo "_________________________________________"
#curl "http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/1/" -H "Accept: application/ld+json "
#echo "_________________________________________"
#curl "http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/1/" -H "Accept: application/x-turtle "
#echo "_________________________________________"
#curl "http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/1/" -H "Accept: text/plain" 
#echo "_________________________________________"
#curl "http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/1/" -H "Accept: json/rdf " 
done
