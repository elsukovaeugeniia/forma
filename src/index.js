document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('popover-btn');
  const popover = document.getElementById('popover');

  if (!btn || !popover) {
    console.error('Кнопка или попвер не найдены в DOM!');
    return;
  }

  // Безопасное заполнение содержимого
  const title = btn.dataset.popoverTitle || 'Заголовок по умолчанию';
  const content = btn.dataset.content || 'Текст контента по умолчанию';

  popover.innerHTML = `
    <div class="popover-title">${title}</div>
    <div class="popover-content">${content}</div>
  `;

  // Обработчик клика по кнопке
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    // Переключаем видимость попвера
    const isVisible = popover.style.display === 'block';
    popover.style.display = isVisible ? 'none' : 'block';

    console.log('Попвер переключён:', isVisible ? 'скрыт' : 'показан');
  });

  // Скрываем попвер при клике вне его области
  document.addEventListener('click', (e) => {
    // Проверяем, что клик был вне попвера и вне кнопки
    if (!popover.contains(e.target) && e.target !== btn) {
      popover.style.display = 'none';
    }
  });

  // Дополнительно: скрываем попвер при нажатии клавиши Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      popover.style.display = 'none';
    }
  });
});

// Вспомогательная функция для программного управления попвером
window.togglePopover = function(show = null) {
  const popover = document.getElementById('popover');
  if (popover) {
    if (show === null) {
      // Переключаем состояние
      popover.style.display =
        popover.style.display === 'block' ? 'none' : 'block';
    } else {
      // Устанавливаем конкретное состояние
      popover.style.display = show ? 'block' : 'none';
    }
  }
};

// Функция для обновления содержимого попвера
window.updatePopoverContent = function(title, content) {
  const popover = document.getElementById('popover');
  const btn = document.getElementById('popover-btn');

  if (popover && btn) {
    // Обновляем dataset кнопки
    if (title) btn.dataset.popoverTitle = title;
    if (content) btn.dataset.content = content;

    // Обновляем содержимое попвера
    const newTitle = title || btn.dataset.popoverTitle || 'Заголовок по умолчанию';
    const newContent = content || btn.dataset.content || 'Текст контента по умолчанию';

    popover.innerHTML = `
      <div class="popover-title">${newTitle}</div>
      <div class="popover-content">${newContent}</div>
    `;
  }
};
