/* AVP Learning Leaderboard owner gate V1
   Home already owns the leaderboard inline. Other pages fall back to the preserved core. */
(function(){
  'use strict';
  if(document.getElementById('avp-llb-inline')) return;
  if(window.__AVP_LEARNING_LEADERBOARD_CORE_LOADING__) return;
  window.__AVP_LEARNING_LEADERBOARD_CORE_LOADING__=true;
  var s=document.createElement('script');
  s.src='learning-leaderboard-core-v1.js?v=20260914-owner1';
  s.defer=true;
  s.dataset.avpLearningLeaderboardCore='1';
  document.head.appendChild(s);
})();
