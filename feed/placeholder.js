(function () {
    var p1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
    var p2 = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.";

    document.querySelectorAll(".card-body").forEach(function (body) {
        if (body.querySelector(".article-body")) return;
        var div = document.createElement("div");
        div.className = "article-body";
        var a = document.createElement("p");
        a.textContent = p1;
        var b = document.createElement("p");
        b.textContent = p2;
        div.appendChild(a);
        div.appendChild(b);
        body.appendChild(div);
    });
}());
