var main = $('.main');
var mainSearch = $('#mainSearch');
var mainSearchInput = $('#mainSearchInput');

var wrapper = $('.wrapper');
var searchInput = $('#searchInput');
var searchbtn = $('#search');

var pages = $$('.pages');
var index = 1;
var goTo = $('.go-to');
var goToPage = $('.go-to-input');
var mark = $('#mark');

var totalPage;

EventUtil.addEvent(mainSearch, 'click' ,function () {
    if (mainSearchInput.value.length) {
        mainToResults();   
    }
})
//When the enter key is pressed in the main page
EventUtil.addEvent(mainSearchInput, 'keyup', function (event) {
    event = EventUtil.getEvent(event);

    if (event.keyCode == 13 && mainSearchInput.value.length) {
        mainToResults();
    }
});

//search
EventUtil.addEvent(searchbtn, 'click', function search() {

    index = 1;
    for (var i = 0; i < pages.length; i++) {
        pages[i].innerHTML = i+1;
    }
    changeClassName(pages);
    pages[0].className = 'pc-index pages'; 
    if (searchInput.value.length) {
        pageTurn();
    } else {
        main.sytle.display = 'block';
        wrapper.style.dispaly = 'none';
    }
});

//When the enter key is presssed in the search results page
EventUtil.addEvent(searchInput, 'keyup', function (event) {
    event = EventUtil.getEvent(event);

    if (event.keyCode == 13) {
        if (searchInput.value.length) {
            index = 1;
            for (var i = 0; i < pages.length; i++) {
                pages[i].innerHTML = i+1;
            }
            changeClassName(pages);
            pages[0].className = 'pc-index pages'; 
            pageTurn();
        } else {
            return 0;
        }
    }
});

//page index btn
for (var i = 0; i < pages.length; i++) {
    EventUtil.addEvent(pages[i], 'click', function () {

        changeClassName(pages);
        backToTop();
        index = parseInt(this.innerHTML);
        pageTurn();            

        if (index > 4) {
            for (var i = 0; i < pages.length; i++) {
                pages[i].innerHTML = i + index - 4;
            }
            mark.className = 'pc-index pages';
        } else {
            this.className = 'pc-index pages';            
        }
    })            
}

//page jumps
// EventUtil.addEvent(goTo, 'click', function() {

//     if (isNaN(goToPage.value)) {
//         return 0;
//     } else {
//         index = parseInt(goToPage.value);
//         changeClassName(pages);
//         if (index > 5 || index < totalPage) {
//             mark.className = 'pc-index pages';            
//             for (var i = 0; i < pages.length; i++) {
//                 pages[i].innerHTML = index + i - 4;
//             }           
//         } else {
//             for (var i = 0; i < pages.length; i++) {
//                 pages[i].innerHTML = i + 1;
//             }
//             pages[index - 1].className = 'pc-index pages';
//         }
//         pageTurn();
//         backToTop();
//     }
//     goToPage.value = '';
// });

//previous page
EventUtil.addEvent($('#prev'), 'click', function () {
    index > 1 ?  index -- : index = 1;
    if (index > 4) {
        whenMark(index, '-');
    } else {
        changeClassName(pages);
        pages[index - 1].className = 'pc-index pages';
    }
        pageTurn();
        backToTop();      
})

var nextPage = function () {
    index ++;
    changeClassName(pages);

    if (index >= totalPage) {
        return 0;
    } else {
        if (index > 5 || index < totalPage - 2) {
            whenMark(index, '+');
            console.log(totalPage);
        } else {
            pages[index - 1].className = 'pc-index pages';    
            // console.log(index);
        }
    }   

    pageTurn();
    backToTop();          

};

//next page
EventUtil.addEvent($('#next'), 'click', nextPage);

// BT-down movies
ajax({
    url: 'http://172.22.161.66/movies',
    method: 'GET',
    success: function (res) {
        var movImg = $$('.movies-img');
        var movTitle = $$('.movies-title');
        var goToMov = $$('.go-to-movies');

        for (var i = 0; i < movTitle.length; i++) {
            movTitle[i].innerHTML = res[i].title;
            goToMov[i].href = res[i].href;
            movImg[i].src = res[i].image;
            
        }

    }
})





function get(res) {
    var time = new Date();
    var resultsTitle = $$('.results-title');
    var resultsContent = $$('.results-content');
    var address = $$('.address');

    if (!res.total || res.total == 0) {
        $('.total-page').innerHTML = '';
        $('.no-results').innerHTML = '很抱歉,没有找到与' + searchInput.value + '相关的网页。';

        $('.page').style.display = 'none';
        $('.search-results').style.display = 'none';
        $('.footer').id = 'mainFooter';
        // $('.page').remove();
        // $('.search-results').remove();
    } else {
        $('.total-page').innerHTML = '共' + res.total + '条结果';
        $('.no-results').innerHTML = '';
        $('.page').style.display = 'block';
        $('.search-results').style.display = 'block';
        $('.footer').id = '';

        totalPage = Math.ceil(res.total / 10);

        if (totalPage < 8 ) {
            for (var i = 8 - totalPage; i <= 7; i++) {
                pages[i].style.display = 'none';
            }
        } else {
            for (var i = 0; i <= 7; i++) {
                pages[i].style.display = 'block';
            }
        } 

        for (var i = 0; i < resultsContent.length; i++) {
            var infor = res.info[i];
            var text = infor.content.text.toString();
            var title = infor.title.toString();
            var leng = [];

            resultsTitle[i].href = infor.url;
            resultsTitle[i].innerHTML = title.length < 38 ?  title : title.slice(0, 37) + '...';

            leng[i] = text.replace(/<em>|<\/em>/g,'');
            resultsContent[i].innerHTML = length[i] <  100 ? text : text.slice(0, 100) + '...';
            time.setTime(infor.fetch_time);

            address[i].href = infor.url;
            address[i].innerHTML = infor.title + '-' + time.toLocaleDateString() + '-';
        }
    }    
} 

function pageTurn () {
    var text = searchInput.value.replace(/\?|\/|\\|\#/,'');
    // console.log(text); 
    ajax({
        url: 'http://172.22.161.66/results/' + text + '/' + index,
        method: 'GET',
        success: function(res) {
            get(res);
        },
    })
}

function whenMark (num, symbol) {
    var count;
    symbol = '-' ? count = 1 + num : count = num;
    for (var i = 0; i < pages.length; i++) {
        pages[i].innerHTML = count + i - 5;
    }
    mark.className = 'pc-index pages';
}

function mainToResults () {
    main.style.display = 'none';
    wrapper.style.display = 'block';
    searchInput.value =  mainSearchInput.value;
    pageTurn();       
    $('.footer').id = '';
}