import React from 'react';
import { Link } from 'react-router-dom';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
//import 'react-toastify/dist/ReactToastify.css';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            users: [],
            selectedFile: null,
        };
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount() {
        this.setState({ 
            user: JSON.parse(localStorage.getItem('user')),
            users: { loading: true }
        });
        //userService.getAll().then(users => this.setState({ users }));
    }

    onChangeHandler(event){
        var files = event.target.files
   
        // if return true allow to setState
           this.setState({
           selectedFile: files,
           loaded:0
        })
      }

     onClickHandler() {
        const image = new FormData();
        let inputFile = this.state.selectedFile[0];
        image.append('image', inputFile);
        const udata = JSON.parse(localStorage.getItem('user'));
        let extensionLists = ["xls","xlsx","xlsm"];
        if(extensionLists.indexOf((inputFile.name).split('.').pop()) > -1){
        if(udata.chemistId){
            axios.post(`http://ec2-13-233-136-145.ap-south-1.compute.amazonaws.com:8080/medihelp/chemist/file?chemistId=${udata.chemistId}`, image, {
            onUploadProgress: ProgressEvent => {
                this.setState({
                loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
                })
            },
            })
            .then(res => { // then print response status
                toast.success('File uploaded successfully')
            })
            .catch(err => { // then print response status
                toast.error('Something went wrong. Please try again')
            })
        }else{
            toast.error('Something went wrong. Please try again');
        }
    } else {
        toast.error('Error Uploading. Please select excel file format');
    }
    }
    render() {
        const { user, users } = this.state;
        return (
            <div className="container">
              <p>
              <Link to="/privacy-policy" style={{float:'right',fontWeight: 500, textDecoration: 'underline'}}>Privacy Policy</Link></p>
                <p><Link to="/login" style={{float:'right',fontWeight: 500, textDecoration: 'underline',clear:'both', marginTop:'0.5%'}}>Logout</Link></p>
                <div className="row">
                <div className="offset-md-3 col-md-6">
                    <div className="form-group files">
                        <h2 style={{fontWeight: "400"}}>File Upload</h2>
                        <input type="file" className="form-control"  accept="*.json" onChange={this.onChangeHandler}/>
                    </div>  
                    <div className="form-group">
                    <ToastContainer />
                    <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
                    </div> 
                    <button type="button"  style={{background: '#5cb85c'}}className="btn btn btn-block" onClick={this.onClickHandler}>Upload</button>
                </div>
                </div>
            </div>
        );
    }
}

export { HomePage };