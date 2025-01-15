document.addEventListener("DOMContentLoaded", function () {
  const basePath = `https://gowthamirasayanasala.github.io/grs-assets`;
  const container = document.getElementById("content-container");

  if (!container) {
    console.error("Element with ID 'content-container' not found in the DOM.");
    return;
  }

  fetch(`${basePath}/assets-names.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderAssetsByType(container, data, basePath);
    })
    .catch((error) => console.error("Error fetching assets:", error));
});

// Function to render assets grouped by type
function renderAssetsByType(container, assets, basePath) {
  const sections = {
    images: createSection(container, "Images"),
    documents: createSection(container, "Documents"),
    audio: createSection(container, "Audio Files"),
  };

  Object.keys(sections).forEach((key) => {
    const sectionWrapper = document.createElement("div");
    sectionWrapper.classList.add("section-wrapper", `${key}-wrapper`);
    sections[key].appendChild(sectionWrapper);
    sections[key].wrapper = sectionWrapper; // Store the wrapper for adding items
  });

  assets.forEach((asset, index) => {
    const fileType = asset.name.split(".").pop();
    const parentDiv = document.createElement("div");
    parentDiv.classList.add("parent-items-wrapper");
    parentDiv.id = `p-${index}`;

    // Buttons container
    const btnDiv = document.createElement("div");
    btnDiv.classList.add("btn-wrapper");

    // Copy URL Button
    const btnCpy = document.createElement("button");
    btnCpy.classList.add("btn-copy");
    btnCpy.textContent = "Copy URL";
    btnCpy.addEventListener("click", function () {
      navigator.clipboard
        .writeText(`${basePath}/${asset.type}/${asset.name}`)
        .then(() => alert("URL copied to clipboard!"))
        .catch((err) => console.error("Error copying URL:", err));
    });

    // QR Code Download Button
    const btnQr = document.createElement("button");
    btnQr.classList.add("btn-qr");
    btnQr.textContent = "QR Code";
    btnQr.addEventListener("click", function () {
      const qr = new QRious({
        value: `${basePath}/${asset.type}/${asset.name}`,
        size: 250,
        level: "H",
      });

      // Convert the QR code to a data URL
      const dataUrl = qr.toDataURL();

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${asset.name.split(".")[0]}_QRCode.png`;

      // Trigger the download
      link.click();
    });

    btnDiv.appendChild(btnCpy);
    btnDiv.appendChild(btnQr);

    switch (fileType) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif": {
        const imgElement = document.createElement("img");
        imgElement.classList.add("rounded-image");
        imgElement.src = `${basePath}/images/${asset.name}`;
        imgElement.alt = `Image: ${asset.name}`;
        parentDiv.appendChild(imgElement);
        sections.images.wrapper.appendChild(parentDiv);
        break;
      }
      case "pdf":
      case "docx":
      case "txt": {
        const docLink = document.createElement("a");
        docLink.href = `${basePath}/docs/${asset.name}`;
        docLink.textContent = `${asset.name}`.split('.')[0];
        docLink.target = "_blank";
        docLink.classList.add("doc-link");
        parentDiv.appendChild(docLink);
        sections.documents.wrapper.appendChild(parentDiv);
        break;
      }
      case "mp3":
      case "wav": {
        const audioElement = document.createElement("audio");
        audioElement.controls = true;
        audioElement.src = `${basePath}/audio/${asset.name}`;
        audioElement.classList.add("audio-player");
        parentDiv.appendChild(audioElement);
        sections.audio.wrapper.appendChild(parentDiv);
        break;
      }
      default:
        console.warn(`Unsupported file type: ${fileType}`);
    }

    parentDiv.appendChild(btnDiv); // Append buttons to the parent div
  });
}

// Function to create and append a section with a title
function createSection(container, title) {
  const section = document.createElement("div");
  section.classList.add("section");

  const header = document.createElement("h2");
  header.textContent = title;
  section.appendChild(header);

  container.appendChild(section);
  return section;
}
