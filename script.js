
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();

  // Ignore blank searches
  if (!query) return;

  // Clear the previous search
  results.innerHTML = "";

  const url =
    `https://commons.wikimedia.org/w/api.php` +
    `?action=query` +
    `&generator=search` +
    `&gsrsearch=${encodeURIComponent(query)}` +
    `&gsrnamespace=6` +
    `&gsrlimit=12` +
    `&prop=imageinfo` +
    `&iiprop=url` +
    `&iiurlwidth=400` +
    `&format=json` +
    `&origin=*`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    const pages = Object.values(data.query?.pages || {});

    pages.forEach((page) => {
      const imageInfo = page.imageinfo?.[0];
      if (!imageInfo) return;

      const card = document.createElement("article");
      card.className = "image-card";

      const link = document.createElement("a");
      link.href = imageInfo.descriptionurl || imageInfo.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const image = document.createElement("img");
      image.src = imageInfo.thumburl || imageInfo.url;
      image.alt = page.title.replace("File:", "");
      image.loading = "lazy";

      const caption = document.createElement("p");
      caption.textContent = page.title.replace("File:", "");

      link.appendChild(image);
      card.appendChild(link);
      card.appendChild(caption);

      results.appendChild(card);
    });

    // Enhancement: show the result count
    const count = document.createElement("p");
    count.className = "result-count";
    count.textContent =
      `Showing ${results.querySelectorAll(".image-card").length} results for "${query}"`;

    results.prepend(count);
  } catch (error) {
    console.error("Image search failed:", error);
  }
});

