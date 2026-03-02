/**
 * raf-shim.js — Animation compatibility shim
 *
 * Ensures GSAP and canvas RAF loops run in any environment:
 * focused tabs, background tabs, and headless preview browsers.
 *
 * Strategy: default to reliable setTimeout(16) RAF (~60 fps in any
 * environment), then promote to native RAF only if it proves it is
 * firing at ≥30 fps.
 *
 * Must be loaded synchronously before GSAP.
 */
(function () {
  try {
    Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
    Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
  } catch (e) {}

  var _native       = window.requestAnimationFrame.bind(window);
  var _nativeCancel = window.cancelAnimationFrame.bind(window);
  var _reliable     = false;  // promoted to true only if native proves fast
  var _fires        = 0;
  var _firstFire    = 0;

  // Default: always-reliable setTimeout(16) shim (~60 fps in any environment)
  window.requestAnimationFrame = function (cb) {
    if (_reliable) return _native(cb);
    return setTimeout(function () { try { cb(performance.now()); } catch (e) {} }, 16);
  };
  window.cancelAnimationFrame = function (id) {
    if (_reliable) return _nativeCancel(id);
    clearTimeout(id);
  };

  // Background probe: if native RAF fires ≥4 times within 150 ms it is a
  // genuine 60-fps browser — switch to it for smoother rendering.
  function probe(ts) {
    if (_firstFire === 0) _firstFire = ts;
    _fires++;
    if (_fires >= 4 && ts - _firstFire < 150) {
      _reliable = true;           // native is fast — hand control back
    } else if (_fires < 10 && !_reliable) {
      _native(probe);             // keep probing (up to 10 native ticks)
    }
  }
  _native(probe);
})();
