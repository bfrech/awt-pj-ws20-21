
$(function() {

  // Globally enable tooltips
  $('[data-toggle="tooltip"]').tooltip();

  /*
   * Manage multilevel dropdown
   */
  $("ul.dropdown-menu [data-toggle='collapse']").on("click", function(event) {

    let parentMenu = $(this).parents('ul.dropdown-menu');

    // Prevent main dropdown from being closed
    event.preventDefault();
    event.stopPropagation();

    // Enlarge dropdown menu (if not already done) and toggle sub-menu collapse
    parentMenu.animate({width: "100%"}, 500);
    $(this).siblings().collapse('toggle');

    // If another sub-menu is still open, close it
    if (!$(this).next().hasClass('show')) {
      $(this).parents('.dropdown-menu').first().find('.show').collapse('hide');
    }

    // If dropdown menu is being closed, close all sub-menus as well
    $(this).parents('div.dropdown-container').on('hidden.bs.dropdown', function(e) {
      $('.dropdown-submenu .show').removeClass("show");
      parentMenu.width("auto");
    });

  });
});

