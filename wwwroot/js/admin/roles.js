document.addEventListener('DOMContentLoaded', function(){
    var addBtn = document.querySelector('.page-header .btn.btn-orange');
    if(addBtn){ addBtn.addEventListener('click', function(){ console.log('Roles: Add Role'); }); }
});