document.addEventListener("DOMContentLoaded", function () {
  // Path to the folder containing images
  const imagePath = "./images/"; //"path/to/your/images/"
  // Reference to the container element

  const container = document.getElementById("image-container");
  // Fetch images

  fetchImages(imagePath)
    .then((images) => {
      renderImages(container, images);
    })
    .catch((error) => console.error("Error fetching images:", error));
});

// Function to fetch images from a folder
async function fetchImages(path) {
  const response = await fetch(path);
  console.log(response.body, typeof response);
  const data = await response.text();
  const parser = new DOMParser();
  const htmlDocument = parser.parseFromString(data, "text/html");
  // Extract image filenames based on your HTML structure
  const images = Array.from(htmlDocument.querySelectorAll(".icon-jpg"))
    .filter((img) => img.href) // Filter out elements without a source attribute
    .map((img) => img.href);
  return images;
}

// Function to render images to the HTML
function renderImages(container, images) {
  const fragment = document.createDocumentFragment();
  images.forEach((image, index) => {
    console.log(image);

    // parent div
    const parentDiv = document.createElement("div");
    parentDiv.classList.add("parent-items-wrapper");
    parentDiv.id = `p-${index}`;

    // image
    const imgElement = document.createElement("img");
    imgElement.classList.add("rounded-image");
    imgElement.src = image;
    imgElement.id = `i-${index}`;

    imgElement.alt = image.toString().split("/")[
      image.toString().split("/").length - 1
    ];

    // btn div
    const btnDiv = document.createElement("div");
    btnDiv.classList.add("btn-wrapper");
    btnDiv.id = `bd-${index}`;

    // buttons
    const btnCpy = document.createElement("button");
    btnCpy.classList.add("btn-copy");
    btnCpy.textContent = "Copy URL";
    btnCpy.id = `bcyp-${index}`;
    btnCpy.name = `bcyp-${index}-n`;

    btnCpy.addEventListener("click", function ($event) {
      // Use the modern Clipboard API
      navigator.clipboard
        .writeText(image)
        .then(() => {
          // Success
        })
        .catch((err) => {
          // Handle errors
          console.error("Unable to copy text to clipboard", err);
        });
    });

    const btnQr = document.createElement("button");
    btnQr.classList.add("btn-qr");
    btnQr.textContent = "QR Code";
    btnQr.id = `bqr-${index}`;
    btnQr.name = `bqr-${index}-n`;

    btnQr.addEventListener("click", function ($event) {
      // Create a QR code
      const qr = new QRious({
        value: image,
        size: 500,
      });

      // Create a canvas element to draw the QR code
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = qr.size;
      canvas.height = qr.size;
      context.clearRect(0, 0, qr.size, qr.size);
      context.drawImage(qr.canvas, 0, 0, qr.size, qr.size);

      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Create a link element
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${
        image
          .toString()
          .split("/")
          [image.toString().split("/").length - 1].split(".")[0]
      }.png`;

      // Trigger a click on the link to start the download
      link.click();
    });

    btnDiv.appendChild(btnCpy);
    btnDiv.appendChild(btnQr);
    parentDiv.appendChild(imgElement);
    parentDiv.appendChild(btnDiv);

    fragment.appendChild(parentDiv);
  });
  container.appendChild(fragment);
}
