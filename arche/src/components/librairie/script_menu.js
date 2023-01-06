const tout = document.querySelector('.tout-lib');
const master = document.querySelector('.master-lib');
const lic = document.querySelector('.lic-lib');
const fav = document.querySelector('.fav-lib');

if (1) {
    tout.addEventListener('click', () => {
        tout.style.background = 'rgba(5, 56, 225, 0.961)';
        master.style.background = 'rgb(124, 152, 255)';
        lic.style.background = 'rgb(124, 152, 255)';
        fav.style.background = 'rgba(53, 220, 90, 0.61)';
    });
      
    master.addEventListener('click', () => {
          master.style.background = 'rgba(5, 56, 225, 0.961)';
          tout.style.background = 'rgb(124, 152, 255)';
          lic.style.background = 'rgb(124, 152, 255)';
          fav.style.background = 'rgba(53, 220, 90, 0.61)';
    });
      
    lic.addEventListener('click', () => {
          lic.style.background = 'rgba(5, 56, 225, 0.961)';
          tout.style.background = 'rgb(124, 152, 255)';
          master.style.background = 'rgb(124, 152, 255)';
          fav.style.background = 'rgba(53, 220, 90, 0.61)';
    });
      
    fav.addEventListener('click', () => {
          fav.style.background = '#27BC48';
          tout.style.background = 'rgb(124, 152, 255)';
          lic.style.background = 'rgb(124, 152, 255)';
          master.style.background = 'rgb(124, 152, 255)';
    });
}