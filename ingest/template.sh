 #curl -X POST -H "Content-Type: application/rdf+ldpath" --data-binary "@post.txt" "http://serv21.ub.uni-heidelberg.de:8080/fedora/rest/fedora:system/fedora:transform/fedora:ldpath/default4/nt:base/fcr:content" 
 curl -X POST -H "Content-Type: application/rdf+ldpath" --data-binary "@post.txt" "http://localhost:8080/fedora/rest/fedora:system/fedora:transform/fedora:ldpath/annotation{$1}/nt:base/fcr:content" 

