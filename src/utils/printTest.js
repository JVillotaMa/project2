// Test script for print functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('Print test script loaded');
  
  // Add event listeners to print buttons
  const printButtons = document.querySelectorAll('.print-button');
  if (printButtons) {
    printButtons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('Print button clicked');
        window.print();
      });
    });
  }
  
  // Add event listeners for print events
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeprint', () => {
      console.log('Before print event fired');
      document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', () => {
      console.log('After print event fired');
      document.body.classList.remove('printing');
    });
  }
});
