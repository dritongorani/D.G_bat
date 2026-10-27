FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY realisations.html /usr/share/nginx/html/realisations.html
COPY js /usr/share/nginx/html/js
COPY css /usr/share/nginx/html/css
COPY nos-realisations /usr/share/nginx/html/nos-realisations

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
