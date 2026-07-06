$(function () {
    $.get('/Admin/Logistics/GetDispatch').done(render).fail(()=>render(demo()));
    function demo(){return [{id:'ORD-001',customer:'Priya S',event:'Wedding',date:'2025-08-15',driver:'Kumar',vehicle:'SBA1234A',status:'dispatch'},{id:'ORD-002',customer:'Ravi M',event:'Corporate',date:'2025-07-20',driver:'Selvam',vehicle:'SBB5678B',status:'dispatch'}];}
    function render(data){const t=$('#logisticsTable tbody');t.empty();data.forEach(r=>{t.append('<tr><td>'+r.id+'</td><td>'+r.customer+'</td><td>'+r.event+'</td><td>'+r.date+'</td><td>'+r.driver+'</td><td>'+r.vehicle+'</td><td><span class="badge badge-dispatch">Dispatch</span></td><td><button class="btn btn-primary btn-xs" onclick="markDelivered(\''+r.id+'\')">Mark Delivered</button></td></tr>');});}
    window.markDelivered=function(id){showToast('Order '+id+' delivered');};
});