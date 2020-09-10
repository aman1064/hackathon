export const getImageObserver = () => {
  return new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target.children[0];
        lazyImage.src = lazyImage.dataset.src;
      }
    });
  });
};
export const getImageObserverIns = () => {
  return new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        if(lazyImage.dataset.src){
          lazyImage.src = lazyImage.dataset.src;
        }else{
          lazyImage.srcset = lazyImage.dataset.srcset;
        }
      }
    });
  });
};
