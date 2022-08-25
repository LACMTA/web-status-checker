const git_api_url = 'https://api.github.com/repos/LACMTA/uptime/commits';
// const debug_url = 'https://api.github.com/repos/upptime/upptime/commits';
// https://github.com/upptime/upptime/blob/master/history/hacker-news.yml
const urls_to_chart = ['metro-net','metro-api']


function init(){
    get_commits();
}

function get_commits(){
    urls_to_chart.forEach(data=> {add_commit_chart(data)});
    // let url_parameter = `/history/hacker-news.yml`
    // let data_url = debug_url + '?path=' + url_parameter+ '&since=2019-01-01T00:00:00Z';
    // fetch(data_url).then(response => response.json()).then(data => {console.log(data)})
}
function get_the_url_parameter(site_to_look_up){
    switch (site_to_look_up) {
        case 'metro-net':
            return '/history/metro-net.yml';
        case 'metro-api':
            return '/history/metro-api.yml';
        }
}
function add_commit_chart(site){
    let url_parameter = get_the_url_parameter(site)
    let data_url = git_api_url + '?path=' + url_parameter+ '&since=2020-01-01T00:00:00Z';
    fetch(data_url).then(response => response.json()).then(data => {
        
        let commit_data = data.map(commit => {
            return {
                date: commit.commit.author.date,
                message: commit.commit.message
            }
        }).reverse();
        console.log(commit_data);
        add_commit_chart_to_page(site, commit_data);
    });
}

function remap_data(time,message){
    console.log(message)
    let this_object = {};
    if (message.includes('🟥')) {
        this_object[time] = '1';
        return this_object
    }
    this_object[time] = '0';
    return this_object;
}

function add_commit_chart_to_page(site, commit_data){
    let chart_container = document.getElementById('chart-container');
    let chart_div = document.createElement('div');
    chart_div.setAttribute('id', 'chart-' + site);
    chart_container.appendChild(chart_div);
    let ctx = document.getElementById('chart-' + site);
    let map1 = commit_data.map(commit => remap_data(commit.date,commit.message));

    console.log(map1);
    // const filtered = new Map(Array.from(map1).filter(([key, value]) => {
    //         if (value.includes('is down')) {
    //           return true;
    //         }
    //         console.log(value);
    //         return false;
    //     })
    //     );
    console.log(Array.from(map1));
    // console.log(filtered);
        // item => item.includes("is down")));
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: commit_data.map(commit => commit.date),
            datasets: [{
                label: 'Commits',
                data: commit_data.map(commit => commit.message),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        }
    });
    ctx.style.height = '200px';
    ctx.style.width = '100%';
    ctx.style.margin = 'auto';
    
        
}

init();

