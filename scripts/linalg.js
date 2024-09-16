function uniform_random_vector(m) {
  var u = new Array(m);
  for (var i=0; i<u.length; i++) {
    u[i] = (Math.random()-0.5)*2;
  }
  return u;
}

function uniform_random_matrix(m,n) {
  var A = new Array(m);
  for (var i=0; i<m; i++) {
    A[i] = uniform_random_vector(n);
  }
  return A;
}


function copy_matrix(A) {
  var B = [];
  for (var i=0; i<A.length; i++) {
    B[i] = A[i].slice()
  }
  return B;
}

function inner(u,v) { // vector inner product
  var val = 0.0;
  for (var i=0; i<u.length; i++) {
    val += u[i]*v[i];
  }
  return val;
}

function outer(u,v) { // outer product of two vectors
  // allocate matrix
  var A = new Array(u.length);
  for (var i=0; i<A.length; i++) {
    A[i] = new Array(v.length);
  }
  // fill matrix
  for (var i=0; i<A.length; i++) {
    for (var j=0; j<A[0].length; j++) {
      A[i][j] = u[i]*v[j];
    }
  }
  return A;
}

function vec_mult(a,v) { // scalar times vector
  var av = new Array(v.length);
  for (var i=0; i<av.length; i++) {
    av[i] = a*v[i];
  }
  return av;
}

function vec_add(u,v) { // addition of two vectors
  var u_p_v = new Array(u.length);
  for (var i=0; i<u_p_v.length; i++) {
    u_p_v[i] = u[i] + v[i];
  }
  return u_p_v;
}

function get_column(A,j) { // get column of a matrix
  var v = new Array(A.length);
  for (var i=0; i<A.length; i++) {
    v[i] = A[i][j];
  }
  return v;
}

function set_column(A,v,j) { // set a column of a matrix
  for (var i=0; i<v.length; i++) {
    A[i][j] = v[i];
  }
  return A;
}

function cgs(A) { // classical Gram-Schmidt orthogonalization
  const m = A.length;    // # rows
  const n = A[0].length; // # cols
  var U = copy_matrix(A);  // will hold orthogonal basis
  var q_k;
  for (var j=0; j<n; j++) {
    q = get_column(U,j);
    for (var k=0; k<j; k++) { // subtract components in existing basis
      q_k = get_column(U,k);
      q = vec_add(q,vec_mult(-inner(q,q_k),q_k))
    }
    q = vec_mult(1/Math.sqrt(inner(q,q)),q)  // normalize
    U = set_column(U,q,j);
  }
  return U;
}

function flatten_matrix(A) {
  var m = A.length;
  var n = A[0].length;
  var v = new Array(m*n);
  for (var i=0; i<m; i++) {
    for (var j=0; j<n; j++) {
      v[i*m + j] = A[i][j];
    }
  }
  return v;
}

function random_rank_1_matrix(m,n) {
  var u = uniform_random_vector(m);
  var v = uniform_random_vector(n);
  var L = outer(u,v);
  return L;
}

function random_rank_k_3x3_flat(k) {
  var A_flat = flatten_matrix(random_rank_1_matrix(3,3));
  for (var i=1; i<k; i++) {
    A_flat = vec_add(A_flat,flatten_matrix(random_rank_1_matrix(3,3)));
  }
  return A_flat;
}

function vector_to_string(v) {  // concatenate floats to spaced string
  var s = "";
  for (var i=0; i<v.length; i++) {
    s += String(v[i]) + " ";
  }
  return s;
}
