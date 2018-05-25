$(function(){
  $('.btn-list').on('click', function(){
    $('#blog_list').hide();
    $('#blog_create').hide();
    $('#display_blog').hide();
    $('#display_edit').hide();
    var btnId = this.id;
    if (btnId == 'blog_list_btn') {
      $('#blog_list').show();
    } else if (btnId == 'blog_create_btn'){
      $('#blog_create').show();
    }
  });
});
