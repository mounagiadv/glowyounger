function is_storage_enabled(){
  /*DONT RENAME/CHANGE THE VARIABLE TEST, testing will work only for variable test*/
  var test = 'test';
  try {localStorage.setItem(test, 'test');localStorage.removeItem(test);return true;} catch(e) {return false;}
}

var _load_ajax_address;
function multi_select_autocomplete(_cn = '', _searchfor = 'clinics', _ajax_url = null, _check = false)
{
  $(_cn).select2({
    allowClear: false,
    ajax: {
      type: 'POST',url: _ajax_url+_searchfor+'/',
      data: function (params) {
        var query = {
          search: params.term,page_no: 1,limit: 10,
          check: _check
        };return query;
      },
      dataType: 'json',
      processResults: function (data) {
        _load_ajax_address = true;
        return {
          results: data.results
        };
      }
    },
    templateSelection: function (data, container) {
      if(data.text){
        $('input[name="clinic_name"]').val(data.text);
      }
      return data.text;
    },
  });
}

$(document).ready(function () {

  /*Scroll - start*/
  var lastScrollTop = 0;
  var didScroll;
  $(window).scroll(function(event){
    didScroll = true;
  });
  setInterval(function() {
    if (didScroll) {
      var st = $(this).scrollTop();
      if(st > 150){
        //$('body').addClass('minimize-header');
      }else{
        //$('body').removeClass('minimize-header');
      }
      lastScrollTop = st;
      didScroll = false;
    }
  }, 100);
  /*Scroll - end*/

  /**/

  if(document.getElementById('leftSiderbar')){
    var leftSiderbar_offcanvas = document.getElementById('leftSiderbar');
    var bs_leftSiderbar_offcanvas = new bootstrap.Offcanvas(leftSiderbar_offcanvas);
  }

  /*Sliders - start*/
  var _items_horizontal_slider = $(".items-horizontal-carousel");
  if(_items_horizontal_slider.length > 0){
    var _icons_base_url = _items_horizontal_slider.data('icons_base_url');
    _items_horizontal_slider.owlCarousel({
      rtl:(($('body').hasClass('rtl')) ? true : false),
      loop:false,
      margin:5,lazyLoad:true,nav:true,dots: false,
      responsive:{
          0:{items:2},576:{items:3},768:{items:3},992:{items:3},1200:{items:4},1400:{items:5}
      },navText : ['<img class="s-icon" src="'+_icons_base_url+'assets/img/icons/left-w.svg">','<img class="s-icon" src="'+_icons_base_url+'assets/img/icons/right-w.svg">'],
    });
  }
  /*Sliders - end*/

  /*scroll to ID - start*/
  $('body').on('click', '.scroll-to', function (e) {
      var _this = $(this);
      if(_this.data('id') && ($(_this.data('id')).length)){
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $(_this.data('id')).get(0).offsetTop - 70
        }, 300);
        if(bs_leftSiderbar_offcanvas)bs_leftSiderbar_offcanvas.hide();
      }
  });
  /*scroll to ID - end*/

  $('body').on('submit', '#contact_form', function (e) {
    e.preventDefault();e.stopImmediatePropagation();
    var _this = $(this);
    var _form_data = _this.serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
    var url = _this.attr('action');
    $('#contact_form').addClass('loading');
    $.ajax({
           type: "POST",
           url: url,
           data: _this.serialize(), // serializes the form's elements.
           success: function(data)
           {
             $('#contact_form').removeClass('loading');
             data = $.parseJSON(data);
							 if(data.success){
                 $('.contactform-message .success-message').find('.return_text').html(data.msg);
                 $('.contactform-message .success-message').show();
								 $('#contact_form').trigger("reset");
                 setTimeout(function () {
                   $('#contact_form').removeClass('was-validated');
                 }, 100);
							 }else{
                 $('.contactform-message .error-message').find('.return_text').html(data.msg);
                 $('.contactform-message .error-message').show();
							 }
           }
         });
	});

  /*Multi select autocomplete*/
  //var _ms_cls = '.multi-select-autocomplete';
  //multi_select_autocomplete(_ms_cls, $(_ms_cls).data('searchfor'), $(_ms_cls).data('url'));
  /*Event for focusing input*/
  $(document).on('select2:open', () => {
    document.querySelector('.select2-search__field').focus();
  });

  /*Open restriction popup*//*
  if(is_storage_enabled() === true){
    try {
      var _hcp_warning = localStorage.getItem('hcp_warning');
      if(_hcp_warning === null){
        var _hcp_warningModel = new bootstrap.Modal(document.getElementById('hcp_warningModel'));
        _hcp_warningModel.show();
      }
    } catch(e){}
  }
  */

  $('body').on('click', '#hcp_warningModel .save-hcp-action', function (e) {
    if(is_storage_enabled() === true){
      try {localStorage.setItem('hcp_warning',1);} catch(e) {/*local storage disabled*/}
    }
  });

});

/*BOOTSTRAP FORM VALIDATION*/
(function () {
  'use strict'
  var forms = document.querySelectorAll('.needs-validation')
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
})()
