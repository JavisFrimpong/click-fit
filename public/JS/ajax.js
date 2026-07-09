$(function () {

    $.ajax({
        url: "https://api.restful-api.dev/objects",
        method: "GET",
        dataType: "json"
    })
    .done(function (data) {
        renderEquipment(data);
    })
    .fail(function () {
        $("#equipmentLoading").remove();
        $("#equipmentContainer").append(
            '<div class="col-12 text-center">' +
                '<p style="color:#999;">Couldn\'t load the equipment feed right now. Try refreshing the page.</p>' +
            '</div>'
        );
    });

    function renderEquipment(items) {
        var $container = $("#equipmentContainer");
        $("#equipmentLoading").remove();

        
        var toShow = items.slice(0, 6);

        toShow.forEach(function (item, i) {
            var name = item.name || ("Item " + (i + 1));
            var rowsHtml = "";

            if (item.data && typeof item.data === "object" && item.data !== null) {
                Object.keys(item.data).forEach(function (key) {
                    var value = item.data[key];
                    rowsHtml +=
                        '<div class="detail-row">' +
                            '<span>' + escapeHtml(key) + '</span>' +
                            '<strong>' + escapeHtml(String(value)) + '</strong>' +
                        '</div>';
                });
            } else {
                rowsHtml = '<div class="detail-row"><span>details</span><strong>not available</strong></div>';
            }

            var card =
                '<div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="' + (i * 100) + '">' +
                    '<div class="equipment-card">' +
                        '<div class="equipment-top">' +
                            '<i class="fas fa-dumbbell"></i>' +
                            '<span>ID #' + escapeHtml(String(item.id)) + '</span>' +
                        '</div>' +
                        '<h3>' + escapeHtml(name) + '</h3>' +
                        rowsHtml +
                        '<a href="#" class="equipment-btn" data-page="equipment">View Details</a>' +
                    '</div>' +
                '</div>';

            $container.append(card);
        });

       
        if (window.AOS) {
            AOS.refreshHard();
        }
    }

    function escapeHtml(str) {
        return $("<div>").text(str).html();
    }

});