var myController = angular.module('myController', ['textAngular', 'myService', 'myDirective', 'ngCookies']);
//HomeController
myController.controller("homeCtrl",['$scope', '$location', 'User', 'Post', function($scope, $location, User, Post) {
	$scope.checkIfsignin = function() {
		$scope.website = User.getSignin() ? "myblog" : "nosignin";
	};
	$scope._checkIfsignin = function() {
		$scope._website = User.getSignin() ? "writePost" : "nosignin";
	};
	$scope.loadHtmlcheck = function() {
		User.checkIfsignin().then(function(resJson) {
			User.setUser(resJson);
			User.setSignin(true);
		}).catch(function() {
			User.setSignin(false);
		});
	};
	$scope.canShow= function() {
		return User.getSignin();
	};
	$scope.logOut = function() {
		User.logOut().then(function() {
			User.setUser({});
			User.setSignin(false);
			$location.path('/menu');
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.loadHtmlcheck();

}]);
//menuController 
myController.controller("menuCtrl", ['$scope', '$location', '$cookies', '$cookieStore', 'Product','User', function($scope, $location, $cookies, $cookieStore, Product,User) {

	$scope.loadProduct = function() {
		Product.loadProduct().then(function(resJson) {
			$scope.products = resJson;
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.getTargetproduct = function(item) {
	
		Product.getProductById(item).then(function() {
			$location.path('/menu-items');
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.$on("parentCtrl-to-postCtrl", function(d, data) {
		$scope.isSearch = true;
		$scope.loadProduct();
	});
	$scope.$on("paging-to-postCtr", function(d, data) {
		$scope.products = data;
	});
	$scope.showByadmin = function() {
		return User.getUser().isAdmin;
	};
	$scope.deleteProduct = function(itemID) {
		$location.path('/');
		Product.deleteProduct(itemID).then(function() {
			
			$location.path('/menu');
		}).catch(function() {
			console.log('deleteProduct fail');
		});
	};
	$scope.editProduct = function(itemID) {
		//console.log(itemID)
		Product.getProductById(itemID).then(function() {
			$cookieStore.put('ifEdit', true);
			$location.path('/add-category');
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.isAdmin = function() {
		return User.getUser().isAdmin;
	};
	$scope.amount = 1;
	$scope.isSearch = false;
	$cookieStore.put('ifEdit', false);
	$scope.loadProduct();
}]);
//menuItems
myController.controller("menuItems", ['$scope', '$location', '$sce', '$cookies', '$cookieStore', '$http', 'Product', 'User', function($scope, $location, $sce, $cookies, $cookieStore, $http, Product, User) {
	$scope.content = '';
	$scope.AlertInfo = '';
	$cookieStore.put('ifEdit', false);
	$cookieStore.put('itemIndex', false);
	$scope.loadDetail = function() {
		$scope.productItems = $cookieStore.get('currentProduct');
	//console.log($scope.productItems)
	};
	$scope.backMenuPage = function() {
		$location.path('/menu');
	};
	$scope.deleteItem = function(itemIndex) {
				$location.path('/');
		Product.deleteItem(itemIndex).then(function() {
				$cookieStore.put('ifEdit', false);
				// console.log($cookieStore.get('currentProduct'))
				$location.path('/menu-items');
		}).catch(function(err) {
			console.log(err);
		});;
	};
	$scope.editItem = function(itemIndex) {
		
		$cookieStore.put('ifEdit', true);
		$cookieStore.put('itemIndex', itemIndex);
		$location.path('/add-menu');
		
	};
	$scope.deleteComment = function(item) {
		Comment.deleteComment(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.editCommentstatus = function(item) {
		Comment.editCommentstatus(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.editComment = function(item) {
		if (item.content !== '') {
			Comment.editComment(item).then(function() {
				$scope.loadComment();
			}).catch(function(err) {
				console.log(err);
			});
		}
	};
	$scope.submitComment = function(content) {
		if ($scope.content !== '') {
			$scope.comment1 = {
				content: $scope.content,
				time: new Date(),
				author: User.getUser().nikiname,
				authorUsername: User.getUser().username,
				id: $cookieStore.get('currentProduct')._id,
				isEdit: false,
				isHide: false
			};
			$scope.content = '';
			Comment.addComment($scope.comment1).then(function() {
				$scope.loadComment();
			}).catch(function(err) {
				console.log(err);
			});
		} else {
			$scope.AlertInfo = 'The content can not be blank';
		}
	};
	$scope.operatorshowByauthor = function(dataJson) {
		if (dataJson.isHide)
			return false;
		return dataJson.authorUsername === User.getUser().username;
	};
	$scope.hideProduct = function(item) {
		Product.hideProduct(item).then(function() {
			$scope.loadDetail();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.showProduct = function(item) {
		Product.showProduct(item).then(function() {
			$scope.loadDetail();
		}).catch(function(err) {
			console.log(err);
		});		
	};
	$scope.hideComment = function(item) {
		Comment.hideComment(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.showComment = function(item) {
		Comment.showComment(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});	
	};
	$scope.clear = function() {
		$scope.AlertInfo = '';
	};
	
	$scope.isAdmin = function() {
		return User.getUser().isAdmin;
	};
	$scope.checkIfhide = function() {		
		return $cookieStore.get('currentProduct').isHide;
	};
	$scope._checkIfhide = function(value) {
		return value;
	};
	
	$scope.showBycomments = function() {
		return Comment.getComments().length === 0 ? true : false;
	};
	$scope.showBysignin = function() {
		return User.getSignin();
	};

	$scope.loadDetail();
}]);
//addCategory Ctrl
myController.controller("addCategory", ['$scope', 'Product', '$location', '$cookies', '$cookieStore', function($scope, Product, $location, $cookies, $cookieStore,Upload) {
	var id;
	var dataJson;
	var items;
	var ifEdit = $cookieStore.get('ifEdit');
	$scope.uploadImageFile = function($file) {
			$scope.selectedFile = $file;
	};
	$scope.add = function() {

		if(!$scope.categoryTitle)$scope.AlertInfo = 'Name be can not empty';
		else if(!$scope.categoryDescription)$scope.AlertInfo = 'Description be can not empty';
		else if(!$scope.categoryShortTitle)$scope.AlertInfo = 'ShortName be can not empty';
		else if(!$scope.categoryImageFile)$scope.AlertInfo = 'Choose image';
		else{
			if(!id&&!ifEdit){
					dataJson = {
						short_title:$scope.categoryShortTitle,
						title: $scope.categoryTitle,
						dec: $scope.categoryDescription,
						images: null, 
						items:[{}]
					};
			}else{
				dataJson = {
						_id:id,
						short_title:$scope.categoryShortTitle,
						title: $scope.categoryTitle,
						dec: $scope.categoryDescription,
						images: $scope.categoryImageFile, 
						items:items
					};
			}
			id="";
			Product.submitProduct(dataJson,$scope.selectedFile).then(function() {
				$cookieStore.put('ifEdit', false);
				$location.path('/menu');
			});
		}
	};
	$scope.clear = function() {
		$scope.AlertInfo = '';
	};
	$scope.cancel = function() {
		$location.path('/menu');
	};
	$scope.isEdit = function(){
		return ifEdit
	}
	$scope.AlertInfo = '';
	if (ifEdit && ifEdit === true) {
		var currentProduct=$cookieStore.get('currentProduct');
		$scope.categoryImageFile = currentProduct[0].images;
		$scope.categoryTitle = currentProduct[0].title;
		$scope.categoryShortTitle = currentProduct[0].short_title;
		$scope.categoryDescription = currentProduct[0].dec;
		id = currentProduct[0]._id;
		items=currentProduct[0].items;
	} else {
		id =$scope.categoryTitle = $scope.categoryShortTitle =$scope.categoryDescription ="";
	}
}]);

//addMenu Ctrl
myController.controller("addMenu", ['$scope', 'Product', '$location', '$cookies', '$cookieStore', function($scope, Product, $location, $cookies, $cookieStore,Upload) {
	var newItem;
	var ifEdit = $cookieStore.get('ifEdit');
	var itemIndex=$cookieStore.get('itemIndex');
	$scope.uploadImageFile = function($file) {
			$scope.selectedFile = $file;
	};

	$scope.add = function() {

		if(!$scope.itemTitle)$scope.AlertInfo = 'Title be can not empty';
		else if(!$scope.itemDescription)$scope.AlertInfo = 'Description be can not empty';
		else if(!$scope.itemShortTitle)$scope.AlertInfo = 'ShortName be can not empty';
		else if(!$scope.itemImageFile)$scope.AlertInfo = 'Choose image';
		else if(!$scope.itemPrice)$scope.AlertInfo = 'Price be can not empty';
		else{
			if(!ifEdit&&!itemIndex){
					newItem = {
						description: $scope.itemDescription,
						image: null,
						price: $scope.itemPrice,
						short_title:$scope.itemShortTitle,
						title: $scope.itemTitle
					};
			}else{
					newItem = {
						description: $scope.itemDescription,
						image: $scope.itemImageFile,
						price: $scope.itemPrice,
						short_title:$scope.itemShortTitle,
						title: $scope.itemTitle
					};
			}
			Product.submitItem(newItem,$scope.selectedFile,itemIndex).then(function() {
				$cookieStore.put('ifEdit', false);
				// console.log($cookieStore.get('currentProduct'))
				$location.path('/menu-items');
			});
		}
	};
	$scope.clear = function() {
		$scope.AlertInfo = '';
	};
	$scope.cancel = function() {
		$location.path('/menu-items');
	};
	$scope.isEdit = function(){
		return ifEdit
	}
	$scope.AlertInfo = '';
	if (itemIndex && ifEdit === true) {
		var currentProduct=$cookieStore.get('currentProduct');
		var  items=currentProduct[0].items;
		var selectedItem=items.splice(itemIndex,1)[0];
		$scope.itemTitle = selectedItem.title;
		$scope.itemDescription = selectedItem.description;
		$scope.itemShortTitle = selectedItem.short_title;
		$scope.itemImageFile = selectedItem.image;
		$scope.itemPrice = selectedItem.price;
	} else {
		$scope.itemTitle = $scope.itemShortTitle =$scope.itemDescription = $scope.itemPrice="";
	}
}]);

//Parent Ctrl
myController.controller("parentCtrl", ['$scope', function($scope) {
	$scope.$on("homesearch-to-parentCtrl", function(d, data) {
		$scope.$broadcast("parentCtrl-to-postCtrl", 'true');
	});

	$scope.$on("myblogsearch-to-parentCtrl", function(d, data) {
		$scope.$broadcast("parentCtrl-to-myblogCtrl", 'true');
	});
}]);

//homepageCtrl
myController.controller("homepageCtrl",['$scope', '$location', 'User', 'Post', function($scope, $location, User, Post) {
	
	$scope.checkIfsignin = function() {
		$scope.website = User.getSignin() ? "myblog" : "nosignin";
	};
	$scope._checkIfsignin = function() {
		
		$scope._website = User.getSignin() ? "writePost" : "nosignin";
		//console.log($scope._website)
		$location.path('/'+$scope._website);
	};
	$scope.loadHtmlcheck = function() {
		User.checkIfsignin().then(function(resJson) {
			User.setUser(resJson);
			User.setSignin(true);
		}).catch(function() {
			User.setSignin(false);
		});
	};
	$scope.canShow= function() {
		return User.getSignin();
	};
	$scope.logOut = function() {
		User.logOut().then(function() {
			User.setUser({});
			User.setSignin(false);
			$location.path('/menu');
		}).catch(function(err) {
			console.log(err);
		});
	};
	
	$scope.loadHtmlcheck();

}]);

//signupCtrl
myController.controller("registCtrl",['$scope', '$http', '$location', 'DataCheck', 'User', function($scope, $http, $location, DataCheck, User) {
	$scope.user = {
		username: '',
		password: '',
		repassword: '',
		nikiname: '',
		email: '',
		isAdmin: false
	};
	$scope.error = {
		username: '',
		password: '',
		repassword: '',
		nikiname: '',
		email: ''
	};
	$scope.show = {
		username: '',
		password: '',
		repassword: '',
		nikiname: '',
		email: ''
	};
	$scope.close = function() {
		$location.path('/menu');
	};
	$scope.clear = function() {
		$scope.user.username = $scope.user.password = $scope.user.repassword = $scope.user.nikiname = $scope.user.email = '';
		$scope.error.username = $scope.error.password = $scope.error.repassword = $scope.error.nikiname = $scope.error.email = '';
		$scope.show.username = $scope.show.password = $scope.show.repassword = $scope.show.nikiname = $scope.show.email = '';
	};
	$scope.formatInfo = function($event) {
		var info = DataCheck.registInfo;
		var name = $event.target.name;
		$scope.show[name] = 'show';
		$scope.error[name] = info[name];
	};
	$scope.checkInput = function($event) {
		var name = $event.target.name;
		var res = DataCheck.regist[name]($scope.user[name]);
		if ("ok" !== res || name === 'password' || name === 'repassword') {
			$scope.error[name] = res;
		} else {
			var str = '{"' + name + '":"' + $scope.user[name] + '"}';
			var _json = JSON.parse(str);
			User.checkDuplicate(_json).then(function(message) {
				$scope.error[name] = message;
			}).catch(function(err) {
				console.log(err);
			});
		}
		$scope.show[name] = 'show';
	};
	$scope.postFrom = function() {
		var flag = true;
		for (var key in DataCheck.regist) {
			if ($scope.error[key] !== 'ok') flag = false;
		}
		if (flag) {
			$scope.user.password = hex_sha1($scope.user.password);
			$scope.user.repassword = $scope.user.password;
			$scope.user.isAdmin = false;
			User.postUser($scope.user).then(function(resJson) {
				User.setUser(resJson);
				$location.path('/menu');
			}).catch(function(err) {
				console.log(err);
			});
		} else {
			for (var key in $scope.show) {
				if ($scope.show[key] === '') {
					$scope.show[key] = 'show';
					$scope.error[key] = 'Can not empty';
				}
			}
		}
	};
}]);


//signin Ctrl
myController.controller("signinCtrl", ['$scope', '$http', '$location', 'User', 'DataCheck', function($scope, $http, $location, User, DataCheck) {
	$scope.show = {
		username: '',
		password: ''
	};
	$scope.error = {
		username: '',
		password: ''
	};
	$scope.initInfo = function() {
		$scope.error.username = $scope.error.password = '';
		$scope.show.username = $scope.show.password = '';
	};
	$scope.checkData = function() {
	var flag = true;
	if (!$scope.username || $scope.username === '') {
		$scope.error.username = DataCheck.signinInfo['empty'];
		$scope.show.username = 'show';
		flag = false;
	}
	if (!$scope.password || $scope.password === '') {
		$scope.error.password = DataCheck.signinInfo['empty'];
		$scope.show.password = 'show';
		flag = false;
	}
	if (flag) {
		var user = {username: $scope.username, password: hex_sha1($scope.password)};
		User.signinPost(user).then(function(resJson) {
			User.setUser(resJson);
			$location.path('/menu');
		}).catch(function(message) {
			$scope.error[message] = DataCheck.signinInfo[message];
			$scope.show[message] = 'show';
		});
	}
	};
	$scope.close = function() {
		//console.log($location)
		$location.path('/menu');
	};
}]);


//Post Ctrl
myController.controller("postCtrl", ['$scope', '$location', '$cookies', '$cookieStore', 'Post','User', function($scope, $location, $cookies, $cookieStore, Post,User) {
	$scope.checkIfsignin = function() {
		$scope.website = User.getSignin() ? "myblog" : "nosignin";
	};
	$scope._checkIfsignin = function() {
		$scope._website = User.getSignin() ? "writePost" : "nosignin";
	};
	$scope.loadHtmlcheck = function() {
		User.checkIfsignin().then(function(resJson) {
			User.setUser(resJson);
			User.setSignin(true);
		}).catch(function() {
			User.setSignin(false);
		});
	};
	$scope.canShow= function() {
		return User.getSignin();
	};
	$scope.logOut = function() {
		User.logOut().then(function() {
			User.setUser({});
			User.setSignin(false);
			$location.path('/menu');
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.loadPost = function() {
		Post.loadPost().then(function(resJson) {
			$scope.posts = resJson;
			$scope.amount = Post.getPostNumbers();
			$scope.$broadcast('postCtrl to pagingDir', 'true');
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.getTargetpost = function(item) {
		Post.getPostById(item).then(function() {
			$location.path('/detailPost');
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.$on("parentCtrl-to-postCtrl", function(d, data) {
		console.log("parentCtrl-to-postCtrl")
		$scope.isSearch = true;
		$scope.loadPost();
	});
	$scope.$on("paging-to-postCtr", function(d, data) {
		$scope.posts = data;
	});
	$scope.amount = 1;
	$scope.isSearch = false;
	$cookieStore.put('ifEdit', false);
	$scope.loadPost();
}]);
//NoSignIn Ctrl
myController.controller("noSigninCtrl", ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.close = function() {
		$location.path('/');
	};
}]);

//MyBlog Ctrl
myController.controller("myblogCtrl", ['$scope', '$location', '$cookies', '$cookieStore', 'Post', function($scope, $location, $cookies, $cookieStore,Post) {
	$scope.loadPost = function() {
		Post.loadPostByauthor().then(function(resJson) {
			$scope.posts = resJson;
			$scope.amount = Post.getPostNumbers();
			$scope.$broadcast('postCtrl to pagingDir', 'true');
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.getTargetpost = function(item) {
		Post.getPostById(item).then(function() {
			$location.path('/detailPost');
		});
	};
	$scope.$on("parentCtrl-to-myblogCtrl", function(d, data) {
		$scope.isSearch = true;
		$scope.loadPost();
	});
	$scope.$on("paging-to-postCtr", function(d, data) {
		$scope.posts = data;
	});
	$scope.amount = 1;
	$cookieStore.put('ifEdit', false);
	$scope.loadPost();
}]);

//WriteBlog Ctrl
myController.controller("writeBlogCtrl", ['$scope', 'Post', '$location', '$cookies', '$cookieStore', 'User', function($scope, Post, $location, $cookies, $cookieStore,User) {
	var id;
	$scope.addPost = function() {
		var dataJson;
		if ($scope.postTitle === '' && $scope.htmlVariable === '') $scope.AlertInfo = 'Title and content can not be empty';
		else if ($scope.postTitle === '' && $scope.htmlVariable !== '') $scope.AlertInfo = 'The title can not be empty';
		else if ($scope.postTitle !== '' && $scope.htmlVariable === '') $scope.AlertInfo = 'Content can not be empty';
		else {
			//console.log($scope.htmlVariable);
			if (!id)
				dataJson = {title: $scope.postTitle, content: $scope.htmlVariable, date: new Date(), author: User.getUser().nikiname, authorUsername: User.getUser().username, isHide: false};
			else
				dataJson = {_id: id, title: $scope.postTitle, content: $scope.htmlVariable, date: new Date(), author: User.getUser().nikiname, authorUsername: User.getUser().username, isHide: false};
			id = "";
			Post.submitPost(dataJson).then(function() {
				$cookieStore.put('ifEdit', false);
				$location.path('/myblog');
			});
		}
	};
	$scope.clear = function() {
		$scope.AlertInfo = '';
	};
	$scope.AlertInfo = '';
	var ifEdit = $cookieStore.get('ifEdit');
	if (ifEdit && ifEdit === true) {
		$scope.postTitle = $cookieStore.get('currentPost').title;
		Post.getPostBy_Id().then(function(resJson) {
			$scope.htmlVariable = resJson;
		});
		id = $cookieStore.get('currentPost')._id;
	} else {
		id = $scope.postTitle = $scope.htmlVariable = "";

	}
}]);
//Detail Ctrl
myController.controller("detailCtrl", ['$scope', '$location', '$sce', '$cookies', '$cookieStore', '$http', 'Post', 'User', 'Comment', function($scope, $location, $sce, $cookies, $cookieStore, $http, Post, User, Comment) {
	$scope.comments = [];
	$scope.content = '';
	$scope.AlertInfo = '';
	$scope.post = {
		_id: '',
		title: '',
		content: '',
		date: '',
		author: '',
		authorUsername: '',
		isHide: ''
	};
	$cookieStore.put('ifEdit', false);
	$scope.loadDetail = function() {
		$scope.post = $cookieStore.get('currentPost');
		Post.getPostBy_Id().then(function(resJson) {
			$scope.post.content = $sce.trustAsHtml(resJson);
		});
		$http.get('/comments/cancelAll').then(function() {
			$scope.loadComment();
		});
	};
	$scope.loadComment = function() {
		Comment.loadComment().then(function(resJson) {
			$scope.comments = resJson;
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.backBlogPage = function() {
		$location.path('/blog');
	};
	$scope.cancel = function(dataJson) {
		Comment.cancel(dataJson).then(function() {
			$scope.loadComment();
		});
	};
	$scope.editPost = function() {
		$cookieStore.put('ifEdit', true);
		$location.path('/writePost');
	};
	$scope.deletePost = function() {
		Post.deletePost().then(function() {
			$location.path('/');
		}).catch(function() {
			console.log('deletePost fail');
		});
	};
	$scope.deleteComment = function(item) {
		Comment.deleteComment(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.editCommentstatus = function(item) {
		Comment.editCommentstatus(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.editComment = function(item) {
		if (item.content !== '') {
			Comment.editComment(item).then(function() {
				$scope.loadComment();
			}).catch(function(err) {
				console.log(err);
			});
		}
	};
	$scope.submitComment = function(content) {
		if ($scope.content !== '') {
			$scope.comment1 = {
				content: $scope.content,
				time: new Date(),
				author: User.getUser().nikiname,
				authorUsername: User.getUser().username,
				id: $cookieStore.get('currentPost')._id,
				isEdit: false,
				isHide: false
			};
			$scope.content = '';
			Comment.addComment($scope.comment1).then(function() {
				$scope.loadComment();
			}).catch(function(err) {
				console.log(err);
			});
		} else {
			$scope.AlertInfo = 'Can not empty';
		}
	};
	$scope.operatorshowByauthor = function(dataJson) {
		if (dataJson.isHide)
			return false;
		return dataJson.authorUsername === User.getUser().username;
	};
	$scope.hidePost = function(item) {
		Post.hidePost(item).then(function() {
			$scope.loadDetail();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.showPost = function(item) {
		Post.showPost(item).then(function() {
			$scope.loadDetail();
		}).catch(function(err) {
			console.log(err);
		});		
	};
	$scope.hideComment = function(item) {
		Comment.hideComment(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.showComment = function(item) {
		Comment.showComment(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});	
	};
	$scope.clear = function() {
		$scope.AlertInfo = '';
	};
	$scope.showByadmin = function() {
		return User.getUser().isAdmin;
	};
	$scope.checkIfhide = function() {		
		return $cookieStore.get('currentPost').isHide;
	};
	$scope._checkIfhide = function(value) {
		return value;
	};
	$scope.showByauthor = function() {
		if ($scope.checkIfhide())
			return false;
		return User.getUser().nikiname == $scope.post.author;
	};
	$scope.showBycomments = function() {
		return Comment.getComments().length === 0 ? true : false;
	};
	$scope.showBysignin = function() {
		return User.getSignin();
	};

	$scope.loadDetail();
}]);

myController.controller("searchCtrl", ['$scope', '$location', '$cookies', '$cookieStore', 'Post', 'User', function($scope, $location, $cookies, $cookieStore, Post, User) {
	$scope.keyWord = "";
	$scope.search = function() {
		var mode = $location.path();
		if (mode === '/') {
			Post.getPostByKeyWord($scope.keyWord).then(function(resJson) {
				$scope.$emit("homesearch-to-parentCtrl", 'true');
			});
		}

		if (mode === '/blog') {
			Post.getPostByKeyWordAndAuthor($scope.keyWord).then(function(resJson) {
				$scope.$emit("myblogsearch-to-parentCtrl", 'true');
			});
		}
		$scope.keyWord = "";
	};
}]);