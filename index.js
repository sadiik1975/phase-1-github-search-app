document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const toggleButton = document.getElementById('toggle-button');

    let searchType = 'users'; // Default search type

    // Handle form submission
    searchForm.addEventListener('submit', event => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            searchGitHub(query, searchType);
        }
    });

    // Toggle search type
    toggleButton.addEventListener('click', () => {
        searchType = searchType === 'users' ? 'repos' : 'users';
        toggleButton.textContent = searchType === 'users' ? 'Search Repos' : 'Search Users';
    });

    // Search GitHub
    function searchGitHub(query, type) {
        const url = type === 'users'
            ? `https://api.github.com/search/users?q=${query}`
            : `https://api.github.com/search/repositories?q=${query}`;

        fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            resultsContainer.innerHTML = '';
            if (type === 'users') {
                displayUsers(data.items);
            } else {
                displayRepos(data.items);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Display users
    function displayUsers(users) {
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <h3>${user.login}</h3>
                <img src="${user.avatar_url}" alt="${user.login}">
                <a href="${user.html_url}" target="_blank">Profile</a>
            `;
            userCard.addEventListener('click', () => fetchUserRepos(user.login));
            resultsContainer.appendChild(userCard);
        });
    }

    // Display repositories
    function displayRepos(repos) {
        repos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.className = 'repo-card';
            repoCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description'}</p>
                <a href="${repo.html_url}" target="_blank">Repository</a>
            `;
            resultsContainer.appendChild(repoCard);
        });
    }

    // Fetch repositories for a user
    function fetchUserRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(repos => {
            resultsContainer.innerHTML = '';
            displayRepos(repos);
        })
        .catch(error => console.error('Error:', error));
    }
});
