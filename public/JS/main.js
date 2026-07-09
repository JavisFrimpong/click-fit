$(function () {

   
    var cfToastEl = document.getElementById("cfErrorToast");
    var cfToast = new bootstrap.Toast(cfToastEl, { delay: 2500 });

    $("a[data-page]").on("click", function (e) {
        var page = $(this).data("page");
       
        if (page === "home") return;

        e.preventDefault();
        $("#cfToastMsg").text("Page not available.");
        cfToast.show();
    });

    $("#newsletterForm").on("submit", function (e) {
        e.preventDefault();
        $("#cfToastMsg").text("Page not available.");
        cfToast.show();
    });

   
    var $dropArea = $("#drop-area");
    var $fileInput = $("#imageInput");
    var $uploadForm = $("#uploadForm");
    var $uploadStatus = $("#uploadStatus");
    var $preview = $("#preview");
    var selectedFile = null;

    $dropArea.on("click", function (e) {
        
        if (e.target === $fileInput[0]) return;
        $fileInput.trigger("click");
    });

    ["dragenter", "dragover"].forEach(function (evt) {
        $dropArea.on(evt, function (e) {
            e.preventDefault();
            e.stopPropagation();
            $dropArea.addClass("active");
        });
    });

    ["dragleave", "drop"].forEach(function (evt) {
        $dropArea.on(evt, function (e) {
            e.preventDefault();
            e.stopPropagation();
            $dropArea.removeClass("active");
        });
    });

    $dropArea.on("drop", function (e) {
        var files = e.originalEvent.dataTransfer.files;
        if (files && files.length) {
            handleFileSelection(files[0]);
        }
    });

    $fileInput.on("change", function () {
        if (this.files && this.files.length) {
            handleFileSelection(this.files[0]);
        }
    });

    function handleFileSelection(file) {
        if (!file.type.match("image.*")) {
            $uploadStatus.html('<div class="alert alert-warning py-2">Please choose an image file.</div>');
            return;
        }
        selectedFile = file;
        $uploadStatus.empty();

        var reader = new FileReader();
        reader.onload = function (e) {
            $preview.html(
                '<div class="preview-item">' +
                    '<img src="' + e.target.result + '" alt="' + file.name + '">' +
                '</div>'
            );
        };
        reader.readAsDataURL(file);
    }

    $uploadForm.on("submit", function (e) {
        e.preventDefault();

        if (!selectedFile) {
            $uploadStatus.html('<div class="alert alert-warning py-2">Choose or drop an image first.</div>');
            return;
        }

        var formData = new FormData();
        formData.append("image", selectedFile);

        $uploadStatus.html('<div class="alert alert-info py-2"><span class="spinner-border spinner-border-sm me-2"></span>Uploading&hellip;</div>');

        $.ajax({
            url: "/upload",
            method: "POST",
            data: formData,
            processData: false,
            contentType: false
        })
        .done(function (res) {
            $uploadStatus.html('<div class="alert alert-success py-2"><i class="fas fa-circle-check me-2"></i>Uploaded as ' + res.file.savedAs + ' to upload_images/.</div>');
            selectedFile = null;
            $fileInput.val("");
        })
        .fail(function (xhr) {
            var msg = (xhr.responseJSON && xhr.responseJSON.error) || "Upload failed — is the Node.js server running?";
            $uploadStatus.html('<div class="alert alert-danger py-2"><i class="fas fa-circle-xmark me-2"></i>' + msg + '</div>');
        });
    });

});