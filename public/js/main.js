
function tabsSwitch(select, number, tabs_prefix, contents_prefix){
  const shapTabs_prefix = '#' + tabs_prefix;
  const shapContents_prefix = '#' + contents_prefix;

  if($(shapTabs_prefix + select).attr('class') === 'active'){
    $(shapContents_prefix + select).animate({
      height : 'toggle'
    },500, function(){
      $(shapContents_prefix + select).css('display', 'none');
    });

    $(shapTabs_prefix + select).removeClass('active');
    for(let i = 1; i <= number; ++i){
      $(shapTabs_prefix + i).show();
    }
  }else{
    console.log(typeof select);
    for(let i = 1; i <= number; ++i){
      if(i === select){
        $(shapTabs_prefix + select).addClass('active');
        continue;
      }
      $(shapTabs_prefix + i).hide();
    }
    console.log(shapContents_prefix + select);
    $(shapContents_prefix + select).animate({
      height : 'toggle'
    },500, function(){
      $(shapContents_prefix + select).css('display', 'block');
    });
  }
}
