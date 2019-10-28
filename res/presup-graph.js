var g = new Graph();
var layouter;
var renderer;
var e1 = 'entity1';
var e2 = 'entity2';
var vp1 = '??';
var vp2 = '??';

var pronouns = ['i','me','you','we','us','he','him','she','her','they','them'];


// filter function - filters elts. out of recip_patterns with matching vp1 & vp2
function filterRPVP1VP2(element, index, array)
{
  if(document.getElementById('e1').value == 'default' && document.getElementById('e2').value == 'default')
  {
    return array[index][0] == vp1 && array[index][1] == vp2;
  }
  if(document.getElementById('e1').value == 'default')
  {
    
  }
  if(document.getElementById('e2').value == 'default')
  {
    
  }
  return false;
}

// filter function - filters elts. out of recip_patterns with matching vp1 only
function filterRPVP1(element, index, array)
{
  if(document.getElementById('e1').value == 'default' && document.getElementById('e2').value == 'default')
  {
    return array[index][0] == vp1;
  }
  else
  {
    // compute first 2 pronouns each time, no matter what ones we're looking for - as efficient 
    // in the grand scheme, and less code to look at.
    var pronSet1 = document.getElementById('e1').value.split('/');
    var pronSet2 = document.getElementById('e2').value.split('/');
    var phrase = element[2].split('_');
    var pronSet = Array();
    for(var i = 0; i < phrase.length; i++)
    {
      if($.inArray(phrase[i],pronouns) != -1)
      {
        pronSet.push(phrase[i]);
      }
      if(pronSet.length == 2)
      {
        break;
      }
    }
    if(document.getElementById('e1').value == 'default')
    {
      return array[index][0] == vp1 && $.inArray(pronSet[1],pronSet2) != -1;
    }
    else if(document.getElementById('e2').value == 'default')
    {
      return array[index][0] == vp1 && $.inArray(pronSet[0],pronSet1) != -1;
    }
    else
    {
      retVal = $.inArray(pronSet[0],pronSet1) != -1 && $.inArray(pronSet[1],pronSet2) != -1;
      return array[index][0] == vp1 && $.inArray(pronSet[0],pronSet1) != -1 && $.inArray(pronSet[1],pronSet2) != -1;
    }
  }
  
  
}

// filter function - filters elts. out of recip_patterns with matching vp2 only
function filterRPVP2(element, index, array)
{
  return array[index][1] == vp2;
}

function filterPCVP1(element, index, array)
{
  if(document.getElementById('e1').value == 'default' && document.getElementById('e2').value == 'default')
  {
    return array[index][0] == vp1;
  }
  else
  {
    return true;  // still have to figure out how to implement pronoun filtering here
  }
}
function filterPCVP2(element, index, array)
{
  return array[index][0] == vp2;
}

function addPresupClassEdges()
{
  edgeLabels = computePresupClasses();
  for(i in g.nodes)
  {
    removeNode(i.id);
  }
  g.addEdge(e1,vp1+' (VP1)',{label:edgeLabels[0]});
  g.addEdge(vp1+' (VP1)',e2,{label:edgeLabels[0]});
  g.addEdge(e2,vp2+' (VP2)',{label:edgeLabels[1]});
  g.addEdge(vp2+' (VP2)',e1,{label:edgeLabels[1]});
  g.getNode(e1).sentiment = edgeLabels[0];
  g.getNode(vp1+' (VP1)').sentiment = edgeLabels[0];
  g.getNode(e2).sentiment = edgeLabels[1];
  g.getNode(vp2+' (VP2)').sentiment = edgeLabels[1];
  layouter = new Graph.Layout.Static(g,[[e1,0,1],[e2,2,1],[vp1+' (VP1)',1,0],[vp2+' (VP2)',1,2]]);
}

function computePresupClasses()
{
  // initialize empty class arrays
  var vp1ClassSets = Array();
  var vp2ClassSets = Array();
  var vp1Classes = Array();
  var vp2Classes = Array();
  
  vp1ClassSets = presup_classes.filter(filterPCVP1).map(function(elt){return elt[1]});
  for(i=0; i < vp1ClassSets.length;i++)
  {
    for(j=0; j<vp1ClassSets[i].length; j++)
    {
      if(!contains(vp1Classes,vp1ClassSets[i][j]))
      {
        vp1Classes.push(vp1ClassSets[i][j]);
      }
    }
  }
  vp2ClassSets = presup_classes.filter(filterPCVP2).map(function(elt){return elt[1]});
  for(i=0; i < vp1ClassSets.length;i++)
  {
    for(j=0; j<vp2ClassSets[i].length; j++)
    {
      if(!contains(vp2Classes,vp2ClassSets[i][j]))
      {
        vp2Classes.push(vp2ClassSets[i][j]);
      }
    }
  }
  
  // assuming (for now) that vp1 precedes vp2 temporally, compute classes,
  // and simplifying (supposing each pair has one possible class assignment),
  // compute classes for verb pair
  retVal = Array();
  
  if(contains(vp1Classes,'positive'))
  {
    if(contains(vp2Classes,'gg'))
    {
      retVal.push('positive');
      retVal.push('gg');
      return retVal;
    }
    else if(contains(vp2Classes,'bg'))
    {
      retVal.push('positive');
      retVal.push('bg');
      return retVal;
    }
    else if(contains(vp2Classes,'ng'))
    {
      retVal.push('positive');
      retVal.push('ng');
      return retVal;
    }
    else
    {
      retVal.push('?');
      retVal.push('?');
      return retVal;
    }
  }
  else if(contains(vp1Classes,'negative'))
  {
    if(contains(vp2Classes,'gb'))
    {
      retVal.push('negative');
      retVal.push('gb');
      return retVal;
    }
    else if(contains(vp2Classes,'bb'))
    {
      retVal.push('negative');
      retVal.push('bb');
      return retVal;
    }
    else if(contains(vp2Classes,'nb'))
    {
      retVal.push('negative');
      retVal.push('nb');
      return retVal;
    }
    else
    {
      retVal.push('?');
      retVal.push('?');
      return retVal;
    }
  }
  else if(contains(vp1Classes, 'neutral'))
  {
    if(contains(vp2Classes,'gn'))
    {
      retVal.push('neutral');
      retVal.push('gn');
      return retVal;
    }
    else if(contains(vp2Classes,'bn'))
    {
      retVal.push('neutral');
      retVal.push('bn');
      return retVal;
    }
    else if(contains(vp2Classes,'nn'))
    {
      retVal.push('neutral');
      retVal.push('nn');
      return retVal;
    }
    else
    {
      if(retVal.length == 0)
      {
        retVal.push('?');
        retVal.push('?');
        return retVal;
      }
    }
  }
  else
  {
    retVal.push('?');
    retVal.push('?');
    return retVal;
  }
  // include other clauses before "else" (i.e. for neutral, reciprocal, etc.)
}

// borrowed from: http://www.jamesrutherford.com/blog/2010/08/07/javascript-associative-array-sort/
// something wrong with this function?
function sort_couplets( coupletA, coupletB ) {

  return coupletA['value'] > coupletB['value'];
}

function computeRecipPatterns()
{
  var vp1VPs = recip_patterns.filter(filterRPVP1).map(function(elt){return elt[1]});
  var newVPs = [];
  for(var i = 0; i < vp1VPs.length; i++)
  {
    if(vp_to_root_map[vp1VPs[i]] != undefined)
    {
      newVPs.push(vp_to_root_map[vp1VPs[i]]);
    }
  }
  
  var vpMultiset = new Array();
  for(i in vp1VPs)
  {
    if(vpMultiset[vp1VPs[i]] != undefined)
    {
      vpMultiset[vp1VPs[i]] += 1;
    }
    else
    {
      vpMultiset[vp1VPs[i]] = 1;
    }
  }
  
  var vpCouplets = new Array();
  for(key in vpMultiset)
  {
    vpCouplets.push({
      key: key,
      value: vpMultiset[key]
    });
  }
  
  vpCouplets.sort(sort_couplets);
  vpCouplets.reverse();
  
  var numOutputVPs = document.getElementById('numOutputVPs').value;
  var vpCount;
  var vpNodes = new Array();
  var staticOrder = new Array();
  
  if(numOutputVPs == 0)
  {
    for(vpCount = 0; vpCount < vpCouplets.length; vpCount++)
    {
      staticOrder.push(['(VP2) ' + vpCouplets[vpCount]['key'],1,vpCount]);
      g.addEdge(e2,'(VP2) ' + vpCouplets[vpCount]['key'],{label:'frequency: ' + vpCouplets[vpCount]['value']});
      g.addEdge('(VP2) ' + vpCouplets[vpCount]['key'],e1,{});
    }
  }
  else
  {
    for(vpCount = 0; vpCount < vpCouplets.length && vpCount < numOutputVPs; vpCount++)
    {
      staticOrder.push(['(VP2) ' + vpCouplets[vpCount]['key'],1,vpCount]);
      g.addEdge(e2,'(VP2) ' + vpCouplets[vpCount]['key'],{label:'frequency: ' + vpCouplets[vpCount]['value']});
      g.addEdge('(VP2) ' + vpCouplets[vpCount]['key'],e1,{});
      
    }
  }
  
  staticOrder.push(['(VP1) ' + vp1,2,vpCount/2]);
  staticOrder.push([e1,0,vpCount/2]);
  g.addEdge('(VP1) ' + vp1,e2);
  staticOrder.push([e2,3,vpCount/2]);
  g.addEdge(e1,'(VP1) ' + vp1);
  
  return staticOrder;
}

function addRecipPatternEdges()
{
  var map = computeRecipPatterns();
  layouter = new Graph.Layout.Static(g,map);
}

// checks membership of an object obj in an array a
function contains(a, obj)
{
  for(var i = 0; i < a.length; i++)
  {
    if(a[i] === obj)
    {
      return true;
    }
  }
  return false;
}


function updateEdges()
{
  if(vp1 != "" && vp2 != "")
  {
    addPresupClassEdges();
  }
  else if(vp1 != "")  // symmetric case yet to be implemented
  {
    addRecipPatternEdges();
  }
}

$(document).ready(function() {
  g.edgeFactory.template.style.directed = true;
  
  document.getElementById('vp1').value = vp1;
  document.getElementById('vp2').value = vp2;
  
  // initialize graph
  g.addEdge(e1,vp1+' (VP1)',{label:'?'});
  g.addEdge(vp1+' (VP1)',e2,{label:'?'});
  g.addEdge(e2,vp2+' (VP2)',{label:'?'});
  g.addEdge(vp2+' (VP2)',e1,{label:'?'});
  
  layouter = new Graph.Layout.Static(g,[[e1,0,1],[e2,2,1],[vp1+' (VP1)',1,0],[vp2+' (VP2)',1,2]]);
  
  function updateGraph()
  {
    g = new Graph();
    g.edgeFactory.template.style.directed = true;
    vp1 = document.getElementById('vp1').value;
    vp2 = document.getElementById('vp2').value;
    updateEdges();
    
    $("div#canvas").empty();
    renderer = new Graph.Renderer.Raphael('canvas', g, $(window).width() - 50, $(window).height() - 150);
  };
  
  $(window).resize(function() {
      updateGraph();
  });
  
  var returnKeyCode = 13;
  var keyUpSelectors = ["#e1", "#e2", "#vp1", "#vp2", "#numOutputVPs"];
  for(var i = 0; i < keyUpSelectors.length; i++)
  {
    $(keyUpSelectors[i]).keyup(function(e) {
      if(e.keyCode == returnKeyCode)
      {
        updateGraph();
      }
    });
  }
  
  $('#process-button').click(function(event) {
    updateGraph();
  });
  updateGraph();
});
