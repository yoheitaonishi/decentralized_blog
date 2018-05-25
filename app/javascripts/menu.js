$(function(){
  $('.btn-list').on('click', function(){
    $('#blog_list').hide();
    $('#blog_create').hide();
    $('#display_blog').hide();
    $('#how_to_use').hide();
    var btnId = this.id;
    if (btnId == 'blog_list_btn') {
      $('#blog_list').show();
    } else if (btnId == 'blog_create_btn'){
      $('#blog_create').show();
    } else if (btnId == 'how_to_use_btn'){
      $('#how_to_use').show();
    }
  });
});
