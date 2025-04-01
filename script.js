let generatedCount = parseInt(localStorage.getItem("generatedCount")) || 0;
let lastGeneratedTime = 0;

document.getElementById("generateBtn").addEventListener("click", generateImage);
document.getElementById("buyBtn").addEventListener("click", openModal);

function generateImage() {
    const currentTime = new Date().getTime();
    if (currentTime - lastGeneratedTime < 8000) {
        alert("Please wait 8 seconds before generating another image!");
        return;
    }

    const prompt = document.getElementById("prompt").value.trim();
    if (prompt === "") {
        document.getElementById("warningMessage").innerText = "Please enter a valid prompt!";
        return;
    } else {
        document.getElementById("warningMessage").innerText = "";
    }

    const type = document.querySelector('input[name="type"]:checked').value;
    document.getElementById("loading").style.display = "block";
    document.getElementById("imageBox").style.display = "none";

    let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${type === "logo" ? 500 : 1920}&height=${type === "logo" ? 500 : 1080}&seed=36&enhance=true&nologo=true&model=flux-pro`;

    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const imageURL = URL.createObjectURL(blob);
            const img = document.createElement("img");
            img.src = imageURL;
            img.className = "generated-img";

            const imageBox = document.getElementById("imageBox");
            imageBox.innerHTML = "";
            imageBox.appendChild(img);
            imageBox.style.display = "block";

            generatedCount++;
            localStorage.setItem("generatedCount", generatedCount);
            updateStats();

            document.getElementById("loading").style.display = "none";
            lastGeneratedTime = new Date().getTime();

            const downloadBtn = document.createElement("button");
            downloadBtn.textContent = "Download Image";
            downloadBtn.className = "download-btn";
            downloadBtn.onclick = function() {
                const link = document.createElement("a");
                link.href = imageURL;
                link.download = `generated_image_${generatedCount}.png`;
                link.click();
            };

            imageBox.appendChild(downloadBtn);
        })
        .catch(() => {
            alert("Error generating image. Try again!");
            document.getElementById("loading").style.display = "none";
        });
}

function updateStats() {
    document.getElementById("imageStats").innerHTML = `You have generated ${generatedCount} images.`;
}

function openModal() {
    document.getElementById("purchaseModal").style.display = "block";
}

function closeModal() {
    document.getElementById("purchaseModal").style.display = "none";
}
