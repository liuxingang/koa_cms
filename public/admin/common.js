var app = {
    toggle: function (el, collectionName, attr, id) {
        $.get('/admin/changeStatus', { collectionName: collectionName, attr: attr, id: id }, function (data) {
            if (data.success) {
                if (el.src.indexOf('yes') != -1) {
                    el.src = '/admin/images/no.gif';
                } else {
                    el.src = '/admin/images/yes.gif';
                }
            }
        })
    },
    // 改变排序
    changeSort(el, collectionName, id) {
        var sortValue = el.value
        $.get('/admin/changeSort', { collectionName: collectionName, id: id,sortValue:sortValue }, function (data) {
        })
    }
}