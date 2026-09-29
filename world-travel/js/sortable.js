// Minimal pointer-based long-press drag-to-reorder for a vertical list of elements.
// No external dependency, tuned for touch (iOS Safari) and mouse.

const LONG_PRESS_MS = 220;
const MOVE_CANCEL_PX = 10;

export function makeSortable(container, itemSelector, onReorder) {
  let dragEl = null;
  let startY = 0;
  let startX = 0;
  let pressTimer = null;
  let dragging = false;
  let pointerId = null;

  function itemsList() {
    return [...container.querySelectorAll(itemSelector)];
  }

  function onPointerDown(e) {
    const item = e.target.closest(itemSelector);
    if (!item) return;
    startX = e.clientX;
    startY = e.clientY;
    pointerId = e.pointerId;

    pressTimer = setTimeout(() => {
      dragging = true;
      dragEl = item;
      item.setPointerCapture?.(pointerId);
      item.classList.add('is-dragging');
      container.classList.add('is-reordering');
    }, LONG_PRESS_MS);

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
  }

  function onPointerMove(e) {
    if (!dragging) {
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) {
        clearTimeout(pressTimer);
      }
      return;
    }
    e.preventDefault();
    const offsetY = e.clientY - startY;
    dragEl.style.transform = `translateY(${offsetY}px)`;

    const items = itemsList().filter((el) => el !== dragEl);
    const dragRect = dragEl.getBoundingClientRect();
    const dragCenter = dragRect.top + dragRect.height / 2;

    for (const sibling of items) {
      const rect = sibling.getBoundingClientRect();
      const siblingCenter = rect.top + rect.height / 2;
      if (dragCenter < siblingCenter && dragEl.compareDocumentPosition(sibling) & Node.DOCUMENT_POSITION_PRECEDING) {
        container.insertBefore(dragEl, sibling);
        break;
      }
      if (dragCenter > siblingCenter && dragEl.compareDocumentPosition(sibling) & Node.DOCUMENT_POSITION_FOLLOWING) {
        container.insertBefore(dragEl, sibling.nextSibling);
        break;
      }
    }
    startY = e.clientY;
    dragEl.style.transform = '';
  }

  function onPointerUp() {
    clearTimeout(pressTimer);
    container.removeEventListener('pointermove', onPointerMove);
    container.removeEventListener('pointerup', onPointerUp);
    container.removeEventListener('pointercancel', onPointerUp);

    if (dragging && dragEl) {
      dragEl.classList.remove('is-dragging');
      dragEl.style.transform = '';
      container.classList.remove('is-reordering');
      const ids = itemsList().map((el) => el.dataset.id);
      onReorder(ids);
    }
    dragging = false;
    dragEl = null;
  }

  container.addEventListener('pointerdown', onPointerDown);

  return {
    destroy() {
      container.removeEventListener('pointerdown', onPointerDown);
    },
  };
}
