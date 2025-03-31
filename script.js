let generatedCount = parseInt(localStorage.getItem("generatedCount")) || 0;

document.getElementById("generateBtn").addEventListener("click", generateImage);

window.addEventListener("beforeunload", function (e) {
    const confirmationMessage = "UNLIMITED FREE IMAGE GENERATION.. ARE YOU GONNA LEAVE?";
    (e || window.event).returnValue = confirmationMessage; // For older browsers
    return confirmationMessage; // For modern browsers
});

function generateImage() {
    const prompt = document.getElementById("prompt").value.trim(); // Get the user's prompt input

    if (prompt === "") {
        alert("Please enter a prompt!");
        return;
    }

    const type = document.querySelector('input[name="type"]:checked').value;

    document.getElementById("loading").style.display = "block"; // Show loading
    document.getElementById("imageBox").style.display = "none"; // Hide image box

    // Determine the URL based on type (Logo or Banner)
    let url;
    if (type === "logo") {
        url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=500&height=500&seed=36&enhance=true&nologo=true&model=flux-pro`;
    } else {
        url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&seed=36&enhance=true&nologo=true&model=flux-pro`;
    }

    // Fetch image and display it
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const imageURL = URL.createObjectURL(blob);
            const img = document.createElement("img");
            img.src = imageURL;

            const imageBox = document.getElementById("imageBox");
            imageBox.innerHTML = ""; // Clear previous image
            imageBox.appendChild(img);
            imageBox.style.display = "block"; // Show the image box

            // Increment the generated image count
            generatedCount++;
            localStorage.setItem("generatedCount", generatedCount);
            updateStats();

            document.getElementById("loading").style.display = "none"; // Hide loading

            // Create a download button for the generated image
            const downloadBtn = document.createElement("button");
            downloadBtn.textContent = "Download Image";
            downloadBtn.className = "download-btn";
            downloadBtn.onclick = function() {
                const link = document.createElement("a");
                link.href = imageURL;
                link.download = `generated_image_${generatedCount}.png`;
                link.click();
            };

            imageBox.appendChild(downloadBtn);  // Add the download button below the image
        })
        .catch(err => {
            console.error("Error generating image: ", err);
            alert("There was an error generating the image.");
            document.getElementById("loading").style.display = "none"; // Hide loading
        });
}

function updateStats() {
    const imageStats = document.getElementById("imageStats");
    imageStats.innerHTML = `You have generated ${generatedCount} images`;
}

document.getElementById("notification").style.display = "block"; // Show notification
setTimeout(function () {
    document.getElementById("notification").style.display = "none";
}, 5000); // Hide notification after 5 seconds
