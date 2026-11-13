['menu', 'menu1', 'menu2'].forEach((id, i) => {
    document.getElementById(id).addEventListener('click', () => {
        window.location.href = ['', '', ''][i];
    });
});
