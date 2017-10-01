var myService = angular.module('myService', ['ngCookies','ngFileUpload']);

myService.factory("User", ['$http', '$location', '$q', function($http, $location, $q) {
	var signIn;
	var currentUser = {};
	var user = {};
	user.checkDuplicate = function(_json) {
		return $http.post('/users/checkDuplicate', _json).then(function(resJson) {
			return $q.resolve(resJson.data);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	user.postUser = function(_json) {
		return $http.post('/users/signup', _json).then(function(resJson) {
			if (resJson.data.status) {
				signIn = true;
				return $q.resolve(resJson.data.res);
			} else {
				return $q.reject();
			}
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	user.signinPost = function(_json) {
		return $http.post('/users/signin', _json).then(function(resJson) {
			if (resJson.data.status) {
				signIn = true;
				return $q.resolve(resJson.data.res);
			} else {
	    		return $q.reject(resJson.data.res);
			}
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	user.logOut = function() {
		return $http.get('/users/logout').then(function() {
			return $q.resolve();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	user.checkIfsignin = function() {
		return $http.get('/users/checkIfsignin').then(function(resJson) {
			return resJson.data.status ? $q.resolve(resJson.data.res) : $q.reject();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	user.setSignin = function(value) {
		signIn = value;
	};
	user.getSignin = function() {
		return signIn;
	};
	user.setUser = function(_json) {
		currentUser = _json;
	};
	user.getUser = function() {
		return currentUser;
	};

	return user;
}]);

myService.factory("DataCheck", function() {
	var _password;
	var registInfo = {
		username: 'UserName 6~12',
		password: 'Password ^12',
		repassword: 'Please enter your password',
		nikiname: 'Number or an underscore',
		email: 'Please enter a email adress'
	};
	var signinInfo = {
		'empty':'Can not be empty',
		'username': 'User does not exist',
		'password': 'Incorrect password'
	};
	var regist = {
	username: function(message) {
		if ("" === message) return "Can not be empty";
		else if (message.length < 6) return "Not less than 6";
		else if (message.length > 18) return "Not more than 18";
		else if (!/^[a-z]/i.test(message)) return "Must begin with an English letter";
		else if (!/^\w*$/.test(message)) return "Can only be English letters, numbers or underscores";
		else return "ok";
		},
	password: function(message) {
		if ("" === message) return "Can not be empty";
		else if (message.length < 6 || message.length > 12) return "Password 6-12 bits";
		else if (!/^[a-z0-9_\-]*$/i.test(message)) return "There are numbers, uppercase and lowercase letters, underlined, and crossed";
		else {
		_password = message;
			return "ok";
			}     
		}, 
	repassword: function(message) {
		if ("" === message) return "Can not be empty";
		else return _password == message ? "ok" : "Not matched";
		},
	nikiname: function(message) {
		if ("" === message) return "Can not be empty";
		else return /^\w*$/.test(message) ? "ok" : "Can only be English letters, numbers or underscores";
		},
	email: function(message) {
		if ("" === message) return "Can not be empty";
		else if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(message)) return "Email Wrong Format";
		else return "ok";
		}
	};
	return {
		regist: regist,
		registInfo: registInfo,
		signinInfo: signinInfo
	};
});


myService.factory("Comment", ['$http', '$location', '$q', '$cookies', '$cookieStore', 'Post', function($http, $location, $q, $cookies, $cookieStore, Post) {
	var comments = [];
	var comment = {};
	comment.loadComment = function() {
		return $http.post('/comments/getComment', {id: $cookieStore.get("currentPost")._id}).then(function(resJson) {
			if (resJson.data.status) {
				comments = resJson.data.comments;
				return $q.resolve(resJson.data.comments);
			}
			else return $q.reject(resJson.data.err);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	comment.addComment = function(dataJson) {
		return $http.post('/comments/addComment', dataJson).then(function(resJson) {
			if (resJson.data.status) return $q.resolve();
			else return $q.reject(resJson.data.err);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	comment.getComments = function() {
		return comments;
	};
	comment.setComments = function(dataJson) {
		comments = dataJson;
	};
	comment.deleteComment = function(dataJson) {
		return $http.post('/comments/deleteComment', {_id: dataJson}).then(function(resJson) {
			if (resJson.data.status) return $q.resolve();
			else return $q.reject();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	comment.editCommentstatus = function(dataJson) {
		return $http.post('/comments/editCommentstatus', {_id: dataJson}).then(function(resJson) {
			if (resJson.data.status) return $q.resolve();
			return $q.reject();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	comment.editComment = function(dataJson) {
		return $http.post('/comments/editComment', dataJson).then(function(resJson) {
			if (resJson.data.status) return $q.resolve();
			else return $q.reject();
		}).catch(function() {
			return $q.reject();
		});
	};
	comment.cancel = function(dataJson) {
		return $http.post('/comments/cancel', {_id: dataJson}).then(function() {
			return $q.resolve();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	comment.showComment = function(dataJson) {
		return $http.post('/comments/showComment', {_id: dataJson}).then(function(resJson) {
			return resJson.data.status ? $q.resolve() : $q.reject();
		});
	};
	comment.hideComment = function(dataJson) {
		return $http.post('/comments/hideComment', {_id: dataJson}).then(function(resJson) {
			return resJson.data.status ? $q.resolve() : $q.reject();
		});
	};	
	return comment;
}]);


app.factory("Post", ['$http', '$location', '$q', '$cookies', '$cookieStore', function($http, $location, $q, $cookies, $cookieStore) {
	var currentPost = {};
	var post = {};
	var posts = [];
	var editPost = {};
	var ifEdit = false;
	var isSearch = false;
	post.submitPost = function(dataJson) {
		return $http.post('/posts/addPost', dataJson).then(function(resJson) {
			if (resJson.data.status) return $q.resolve();
			else return $q.reject();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};

	post.loadPost = function() {
		if (isSearch) {
			var temps = [];
			if (posts.length > 7)
				temps = posts.slice(0, 7);
			else
				temps = posts;
			isSearch = false;
			return $q.resolve(temps);
		} else {
			return $http.get('/posts/getAllPost').then(function(resJson) {
             
				if (!resJson.data.status) return $q.reject();
				var temps = [];
				posts = resJson.data.posts;
				if (posts.length > 7)
					temps = posts.slice(0, 7);
				else
					temps = posts;
				return $q.resolve(temps);
			}).catch(function(err) {
				return $q.reject(err);
			});
		}
	};
	post.getPostNumbers = function() {
		return posts.length;
	};
	post.getPostByClickPage = function(item) {
		var end = item * 7;
		var start = (item - 1) * 7;
		var temps = [];
		if (end > posts.length)
			temps = posts.slice(start, posts.length);
		else
			temps = posts.slice(start, end);
		return $q.resolve(temps);
	};
	post.getPostByKeyWord = function(dataJson) {
		return $http.post('/posts/getPostByKeyWord', {keyWord: dataJson}).then(function(resJson) {
			if (!resJson.data.status) return $q.reject(); 
			posts = resJson.data.posts;
			isSearch = true;
			return $q.resolve(posts);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	post.getPostByKeyWordAndAuthor = function(dataJson) {
		return $http.post('/posts/getPostByKeyWordAndAuthor', {keyWord: dataJson}).then(function(resJson) {
			if (!resJson.data.status) return $q.reject();
			posts = resJson.data.posts;
			isSearch = true;
			return $q.resolve(posts);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	post.loadPostByauthor = function() {
		if (isSearch) {
			var temps = [];
			if (posts.length > 7)
				temps = posts.slice(0, 7);
			else
				temps = posts;
			isSearch = false;
			return $q.resolve(temps);
		} else {
			return $http.get('/posts/getPostByauthor').then(function(resJson) {
				if (!resJson.data.status) return $q.reject();
				var temps = [];
				posts = resJson.data.post;
				if (posts.length > 7)
					temps = posts.slice(0, 7);
				else
					temps = posts;
				return $q.resolve(temps);
			}).catch(function(err) {
				return $q.reject(err);
			});
		}
	};
	post.deletePost = function() {
		var item = $cookieStore.get('currentPost')._id;
		return $http.post('/posts/deletePost', {_id: item}).then(function(resJson) {
			if (resJson.data.status) 
				return $q.resolve();
			else
				return $q.reject();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};

	post.getPostById = function(item) {
		
		return $http.post('/posts/getPostById', {_id: item}).then(function(resJson) {
			if (!resJson.data.status) return $q.reject();
			currentPost = resJson.data.post;
  			$cookieStore.put('currentPost', resJson.data.post);
			return $q.resolve();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	post.getPostBy_Id = function() {
		var item = $cookieStore.get('currentPost')._id;
		return $http.post('/posts/getPostContent', {_id: item}).then(function(resJson) {
			if (resJson.data.status)
				return $q.resolve(resJson.data.post.content);
			else 
				return $q.reject();
		});
	};
	post.showPost = function(item) {
		return $http.post('/posts/showPost', {_id: item}).then(function(resJson) {
			if (resJson.data.status) {
				var cur = $cookieStore.get('currentPost');
				cur.isHide = false;
				$cookieStore.put('currentPost', cur);
				return $q.resolve();
			} else {
				return $q.reject();
			}
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	post.hidePost = function(item) {
		return $http.post('/posts/hidePost', {_id: item}).then(function(resJson) {
			if (resJson.data.status) {
				var cur = $cookieStore.get('currentPost');
				cur.isHide = true;
				$cookieStore.put('currentPost', cur);
				return $q.resolve();
			} else {
				return $q.reject();
			}
		}).catch(function(err) {
			return $q.reject(err);
		});
	};

	return post;
}]);

app.factory("Product", ['$http', '$location', '$q', '$cookies', '$cookieStore','Upload', function($http, $location, $q, $cookies, $cookieStore,Upload) {
	var currentProduct = {};
	var product = {};
	var products = [];
	var editProduct = {};
	var ifEdit = false;
	var isSearch = false;
	product.submitProduct = function(dataJson,image) {

		if(image){
			return Upload.upload ({
				url: '/productRoute/uploadfile',
				file:image,
				data:{
					short_title:dataJson.short_title
				}
			}).then(function (resp) { 
				if(resp.data.fileName){ //validate success
					dataJson.images=resp.data.fileName
						return $http.post('/productRoute/addProduct', dataJson).then(function(resJson) {
						if (resJson.data.status) 
							return $q.resolve();
						else 
							return $q.reject();
						}).catch(function(err) {
							return $q.reject(err);
					});
				} else {
					console.log(resp.data);
					return $q.reject();
				}
			}).catch(function(err) {
				return $q.reject(err);
			});
			
		}else{
				return $http.post('/productRoute/addProduct', dataJson).then(function(resJson) {
					if (resJson.data.status) 
						return $q.resolve();
					else 
						return $q.reject();
					}).catch(function(err) {
						return $q.reject(err);
				});
		}
	};
	
	product.submitItem = function(newItem,image,itemIndex) {
		var currentCategory=$cookieStore.get('currentProduct');
		var items=currentCategory[0].items
		
		if(image){
			return Upload.upload ({
				url: '/productRoute/uploadfile',
				file:image,
				data:{
					short_title:newItem.short_title
				}
			}).then(function (resp) { 
				if(resp.data.fileName){ //validate success
					newItem.image=resp.data.fileName
					items.splice(itemIndex,1,newItem);
					currentCategory[0].items=items;
						return $http.post('/productRoute/addProduct', currentCategory[0]).then(function(resJson) {
							if (resJson.data.status){
								$cookieStore.put('currentProduct',currentCategory);
								return $q.resolve();
								
							} else 
								return $q.reject();
						}).catch(function(err) {
							return $q.reject(err);
						});
				} else {
					console.log(resp.data);
					return $q.reject();
				}
			}).catch(function(err) {
				return $q.reject(err);
			});
			
		}else{
			items.splice(itemIndex,1,newItem);
			currentCategory[0].items=items;
				return $http.post('/productRoute/addProduct', currentCategory[0]).then(function(resJson) {
					if (resJson.data.status){
							$cookieStore.put('currentProduct',currentCategory);
						return $q.resolve();
						
					} 

					else 
						return $q.reject();
					}).catch(function(err) {
						return $q.reject(err);
					});
		}
	};
	
	product.deleteItem = function(itemIndex){
			
		var currentCategory=$cookieStore.get('currentProduct');
		var items = currentCategory[0].items
		items.splice(itemIndex,1);
		currentCategory[0].items=items;
		return $http.post('/productRoute/addProduct', currentCategory[0])
				.then(function(resJson) {
					if (resJson.data.status){
							$cookieStore.put('currentProduct',currentCategory);
							return $q.resolve();
								
					} else 
							return $q.reject();
				})
				.catch(function(err) {
							return $q.reject(err);
				});
		
	}
	
	product.loadProduct = function() {
		// if (isSearch) {
			// var temps = [];
			// if (products.length > 7)
				// temps = products.slice(0, 7);
			// else
				// temps = products;
			// isSearch = false;
			// return $q.resolve(temps);
		// } else {
			return $http.get('/productRoute/getAllProduct').then(function(resJson) {
            //console.log(resJson)
				if (!resJson.data.status) return $q.reject();
				var temps = [];
				return resJson.data.Product;
				// products = resJson.data.Product;
			//console.log(products)
				// if (products.length > 7)
					// temps = products.slice(0, 7);
				// else
					// temps = products;
					// temps = products;
				// return $q.resolve(temps);
			}).catch(function(err) {
				return $q.reject(err);
			});
		// }
	};
	
	product.getProductNumbers = function() {
		//console.log(products)
		return products.length;
	};
	
	product.getProductByClickPage = function(item) {
		var end = item * 7;
		var start = (item - 1) * 7;
		var temps = [];
		if (end > products.length)
			temps = products.slice(start, products.length);
		else
			temps = products.slice(start, end);
		return $q.resolve(temps);
	};
	
	product.getProductByKeyWord = function(dataJson) {
		return $http.post('/productRoute/getProductByKeyWord', {keyWord: dataJson}).then(function(resJson) {
			if (!resJson.data.status) return $q.reject(); 
			products = resJson.data.products;
			isSearch = true;
			return $q.resolve(products);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	
	product.getProductByKeyWordAndAuthor = function(dataJson) {
		return $http.post('/productRoute/getProductByKeyWordAndAuthor', {keyWord: dataJson}).then(function(resJson) {
			if (!resJson.data.status) return $q.reject();
			products = resJson.data.products;
			isSearch = true;
			return $q.resolve(products);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	
	product.loadProductByauthor = function() {
		if (isSearch) {
			var temps = [];
			if (products.length > 7)
				temps = products.slice(0, 7);
			else
				temps = products;
			isSearch = false;
			return $q.resolve(temps);
		} else {
			return $http.get('/productRoute/getProductByauthor').then(function(resJson) {
				if (!resJson.data.status) return $q.reject();
				var temps = [];
				products = resJson.data.product;
				if (products.length > 7)
					temps = products.slice(0, 7);
				else
					temps = products;
				return $q.resolve(temps);
			}).catch(function(err) {
				return $q.reject(err);
			});
		}
	};
	
	product.deleteProduct = function(itemID) {

		return $http.post('/productRoute/deleteProduct', {_id: itemID}).then(function(resJson) {

			if (resJson.data.status)
					return $q.resolve();
			else
				return $q.reject();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};

	product.getProductById = function(item) {
		
		return $http.post('/productRoute/getProductById', {_id: item}).then(function(resJson) {
			
			if (!resJson.data.status) return $q.reject();
			currentProduct = resJson.data.Product;
			//console.log(currentProduct)
  			$cookieStore.put('currentProduct',currentProduct);
			return $q.resolve();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	
	product.getProductBy_Id = function() {
		var item = $cookieStore.get('currentProduct')._id;
		console.log(item)
		return $http.post('/productRoute/getProductContent', {_id: item}).then(function(resJson) {
			if (resJson.data.status)
				return $q.resolve(resJson.data.product.content);
			else 
				return $q.reject();
		});
	};
	
	product.showProduct = function(item) {
		return $http.post('/productRoute/showProduct', {_id: item}).then(function(resJson) {
			if (resJson.data.status) {
				var cur = $cookieStore.get('currentProduct');
				cur.isHide = false;
				$cookieStore.put('currentProduct', cur);
				return $q.resolve();
			} else {
				return $q.reject();
			}
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	
	product.hideProduct = function(item) {
		return $http.post('/productRoute/hideProduct', {_id: item}).then(function(resJson) {
			if (resJson.data.status) {
				var cur = $cookieStore.get('currentProduct');
				cur.isHide = true;
				$cookieStore.put('currentProduct', cur);
				return $q.resolve();
			} else {
				return $q.reject();
			}
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	//console.log(product)
	return product;
}]);