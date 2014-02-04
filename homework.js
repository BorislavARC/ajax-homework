

document.getElementsByClassName('find')[0].addEventListener('click', githubFind);

function githubFind(){
    var searchString = document.getElementsByClassName('search')[0].value,
        name = document.getElementsByClassName('name')[0].children[0],
        email = document.getElementsByClassName('email')[0].children[0],
        followers = document.getElementsByClassName('followers')[0].children[0],
        repo = document.getElementsByClassName('repo')[0],
        error = document.getElementsByClassName('error-message')[0],
        person = { },
        savedPerson = JSON.parse(localStorage.getItem(searchString)),
        expires = +new Date() + 86400000;

    error.innerHTML = '';
    name.innerHTML = '';
    email.innerHTML = '';
    followers.innerHTML = '';
    repo.innerHTML = '';

    if(searchString === '') {
        error.innerHTML = 'Введите имя для поиска!';
        return;
    }

    if(savedPerson) {
        if(savedPerson.expires < +new Date()) {
            localStorage.removeItem(searchString);
            getData()
        } else {
        name.innerHTML = savedPerson.name || 'Не указано имя';
        email.innerHTML = savedPerson.email || 'Не указан email';
        followers.innerHTML = savedPerson.followers;
        repo.innerHTML = savedPerson.repo.join('');
        }
    } else {
        getData()
    }

    function getData() {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://api.github.com/users/' + searchString, true);

        xhr.onload = function() {
            if (xhr.readyState != 4) {
                return;
            } else if(xhr.status == 404) {
                error.innerHTML = 'Пользователь не найден!';
                return;
            } else if(xhr.status != 200) {
                error.innerHTML = 'Ошибка ' + xhr.status + ': ' + xhr.statusText;
                return;
            } else {
                var data = eval( '(' + this.responseText + ')');
                name.innerHTML = data.name || 'Не указано имя';
                email.innerHTML = data.email || 'Не указан email';
                followers.innerHTML = data.followers;
                person.name = data.name;
                person.email = data.email;
                person.followers = data.followers;
            }
        };
        xhr.send('');


        var xhr1 = new XMLHttpRequest();

        xhr1.open('GET', 'https://api.github.com/users/' + searchString + '/repos?per_page=9999', true);

        xhr1.onload = function() {
            if (xhr.readyState != 4) {
                return;
            } else if(xhr.status != 200) {
                return;
            } else {
                var data = eval( '(' + this.responseText + ')');
                var repositories = ['<caption>Названия всех публичных репозиториев:</caption>'];

                for(var i = 0; i < data.length; i++) {
                    repositories.push('<tr><td>' + (i+1) + '</td><td><a href="' + data[i].html_url + '"> ' + data[i].name + '</a></td></tr>');
                }
                if(repositories[1] === undefined) {
                    repositories[1] = '<tr style="text-align: center"><td class="label label-important"> Не найдены репозитории </td></tr>'
                }
                repo.innerHTML = repositories.join('');
                person.repo = repositories;
                person.expires = expires;

                setTimeout(function() {
                    localStorage.setItem(searchString, JSON.stringify(person));
                }, 1000);
            }
        };
        xhr1.send('');
    }
}
