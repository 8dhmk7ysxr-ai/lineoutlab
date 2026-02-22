self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("lineoutlab").then(cache =>
      cache.addAll([
        "index.html",
        "style.css",
        "app.js"
      ])
    )
  );
});