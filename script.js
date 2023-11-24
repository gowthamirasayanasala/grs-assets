document.addEventListener("DOMContentLoaded", function () {
  // Path to the folder containing images
  const basePath = `https://gowthamirasayanasala.github.io/grs-assets`;

  const container = document.getElementById("image-container");

  // Fetch images

  const data = fetch(`${basePath}/assets-names.json`)
    .then((response) => {
      // Check if the request was successful (status code 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON in the response
      return response.json();
    })
    .then((data) => {
      // Do something with the JSON data
      console.log(data);
      renderImages(
        container,
        data.map((n) => n.name),
        basePath
      );
    })
    .catch((error) => console.error("Error fetching images: ee", error));
});

// Function to render images to the HTML
function renderImages(container, images, basePath) {
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
    imgElement.src = `${basePath}/images/${image}`;
    imgElement.id = `i-${index}`;
    imgElement.alt = image.toString().split("/")[
      image.toString().split("/").length - 1
    ];

    // dock div
    const docDiv = document.createElement("div");
    docDiv.classList.add("docDiv");
    docDiv.id = `dd-${index}`;
    docDiv.innerText = image.split(".")[0]

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
        .writeText(
          `${basePath}/images/${
            image.toString().split("/")[image.toString().split("/").length - 1]
          }`
        )
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
        value: `${basePath}/images/${
          image.toString().split("/")[image.toString().split("/").length - 1]
        }`,
        size: 500,
        level: "H",
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
    switch (image.split(".")[1]) {
      case "pdf":
        parentDiv.appendChild(docDiv);
        break;

      default:
        parentDiv.appendChild(imgElement);
        break;
    }

    parentDiv.appendChild(btnDiv);

    fragment.appendChild(parentDiv);
  });
  container.appendChild(fragment);
}
