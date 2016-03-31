// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from 'backbone'

function app() {


//global variables




 var ListingsView = React.createClass({

    componentWillMount: function() {
        var self = this
        this.props.jsonData.on('sync',function() {self.forceUpdate()})
    },
    	render: function() {

    		return (
    			<div className="pageDiv">
    			<h1 className="bgClip">Etsy</h1>
  
    			<ListingGrid jsonData ={this.props.jsonData}/>
    			</div>
    			)
    	}
    })

 var DetailView = React.createClass({

		componentWillMount: function(){
			var self = this
			this.props.detailData.on('sync',function() {self.forceUpdate()})
		  console.log(this.props.detailData)
    },

		render: function() {
		

			return (
				<div className="listingContainer" >
          <DetailTitle listing={this.props.detailData}/>
				</div>
				)
		}
	})



//Daily View-----------------------------------------
var DetailTitle = React.createClass({

    // initialize: function(inputModel) {
    //     this.model = inputModel
    //     console.log(this.model)
    //     var boundRender = this.render.bind(this)
    //     this.props.listing.on("sync", boundRender)
    // },

    render: function() {
      console.log(this.props.listing)
        var data = this.props.listing.models[0].attributes
        console.log(data)
                 if (data.Images !== undefined) {
                var imageURL = data.Images[0].url_570xN
            } 
        else {

            var imageURL = "http://www.newyorker.com/wp-content/uploads/2014/08/Stokes-Hello-Kitty2-1200.jpg"

        }
       
        return (
           <div className = "detail"> 
           <div className = "words"> 
           <h1> Price </h1>
           <h2> $' {data.price} '</h2>
           <h1> When Made</h1>
           <h2> {data.when_made} </h2>
           <h1> Quantity </h1>
           <h2> {data.quantity} </h2>
           <h1> Who Made </h1>
           <h2>  {data.who_made} </h2>
           <h1> User ID:</h1>
           <h2>  {data.user_id}</h2>
           </div>
           <div className= "image"> 
           <img className= "detailImage" src={imageURL} /> 
           </div>
           </div>

    )
}

})


//Current View------------------------------
var Listing = React.createClass({

    _triggerDetailView: function(clickEvent) {
        console.log(clickEvent.target)
        var item = clickEvent.target
        

       var id = this.props.listing.listing_id

       console.log(id)
       
        window.location.hash = "detail/" + id  //<= adding each id to the URL after the hash in order to inform the Router to change the view
    },

    render: function() {
                 if (this.props.listing.Images !== undefined) {
                var imageURL = this.props.listing.Images[0].url_570xN
            } 
        else {
            var imageURL = "http://www.newyorker.com/wp-content/uploads/2014/08/Stokes-Hello-Kitty2-1200.jpg"
        }

      	return (       

            <div listing={this.props.listing} className = "object"><div className = "objectTitle"> {this.props.listing.title} </div>
            <img onClick={this._triggerDetailView} listing={this.props.listing}  src= {imageURL}></img>
            </div>
            )
    }
})

var ListingGrid = React.createClass({
    
    _getListingsJsx: function(resultsArr, i){
    	var jsxArray = []
        for (var i = 0; i < resultsArr.length; i++) {
            var dataObject = resultsArr[i].attributes
            console.log(dataObject)
            var component = <Listing listing={dataObject} key={i} />
            jsxArray.push(component)
   		 }
   		 return jsxArray
	},

    // _triggerDetailView: function(clickEvent) {
    //     console.log(clickEvent.target)
    //     var item = clickEvent.target
    //    var id = item.id
    //    console.log(id)
    //     window.location.hash = "detail/" + id  //<= adding each id to the URL after the hash in order to inform the Router to change the view
    // },

    render: function() {
    	var data = this.props.jsonData.models
    	   console.log(data)
    	return(
        <div className="listingContainer">
    <div className="underlay">
	{this._getListingsJsx(data)}
		</div>
    </div>
				)

    }
})


 var detailCollection = Backbone.Collection.extend({
    url: "https://openapi.etsy.com/v2/listings/",

   initialize: function(id) {
       this.url = `https://openapi.etsy.com/v2/listings/${id}.js?api_key=6lzngc5pqpoufi9bvrt6zupg&includes=Images&callback=?`
       console.log(this.url)

     },
       parse: function(rawData) {
      return rawData.results
    }

    
 })

  var ListingsCollection = Backbone.Collection.extend({
  // url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?&includes=Images'
  url: "https://openapi.etsy.com/v2/listings/active.js?api_key=6lzngc5pqpoufi9bvrt6zupg&includes=Images&callback=?",
  parse: function(rawData) {
      return rawData.results
    }
  })

var etsyRouter = Backbone.Router.extend({
    routes: {
        "detail/:id": "detail",
        "*default": "home"
		},
			home: function() {
        var listCollection = new ListingsCollection()
        listCollection.fetch()
        console.log(listCollection)
			DOM.render(<ListingsView jsonData={listCollection}/>, document.querySelector('.container'))
		},
			
			detail: function(id) {
			var dv = new detailCollection(id)
			dv.fetch()
			DOM.render(<DetailView detailData={dv}/>, document.querySelector('.container'))
		},



 initialize: function() {
        Backbone.history.start()

    }

})


var rtr = new etsyRouter()

}

app()
