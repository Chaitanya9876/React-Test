import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';

class File extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div className="file-name">
            <span className="label-name">{this.props.file.name}</span>
            <a href={this.props.file.url} className="link" target="_blank" download>Download</a>
            </div>
        )
    }
}

class FilesList extends React.Component {

    constructor() {
        super();

        this.state = {
            data: [],
            link : ''
        }
    }

    componentDidMount() {
        $.ajax({
            url: this.props.API_URL,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.API_URL, status, err.toString());
            }.bind(this)
        });
    }

    processStatus (response) {// process status
        if (response.status === 200 || response.status === 0) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error('Error loading: ' + url))
        }
    };

    parseBlob(response) {
        return response.data;
    };

    parseJson(response) {
        return response.json();
    };

    downloadFile(url) {
        return axios.get(url)
        .then(this.processStatus)
        .then(this.parseBlob);
    };

    sourceImageUrl(blob) {
        var formData = new FormData();
        formData.append('type', 'file');
        formData.append('image', blob);

        $.ajax({
            url: this.props.API_URL + 'upload_file',
            type: 'POST',
            data: formData,
            xhr: function () {
                var xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener("progress", function (e) {
                    if (e.lengthComputable) {
                        $('progress').attr({value: e.loaded, max: e.total});
                        $('#status').empty().text(parseInt((e.loaded / e.total * 100)) + '%');
                    }
                }, false);

                return xhr;
            }.bind(this),
            success: function (data) {
                this.setState({
                    data: JSON.parse(data)
                });
                $('#status').empty().text('Successfully loaded!');
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.API_URL, status, err.toString());
            }.bind(this),
            cache: false,
            contentType: false,
            processData: false
        });
    }

    handleFileFromURL(e){
        e.preventDefault();

      if(this.state.link){
          return this.downloadFile(this.state.link)// download file from one resource
          .then(this.uploadImageToAPI)// upload it to another
          .then(function (data) {
              // image upload successfully
          })
          .catch(function (error) {
              console.error(error.message ? error.message : error);
          });
      }
    }

    handleFile(e) {
        e.preventDefault();

        var formData = new FormData($('form')[0]),
        isFileExist = !!$('input[type=file]')[0].files[0];

        if (isFileExist) {
            $.ajax({
                url: this.props.API_URL + 'upload_file',
                type: 'POST',
                data: formData,
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();

                    xhr.upload.addEventListener("progress", function (e) {
                        if (e.lengthComputable) {
                            $('progress').attr({value: e.loaded, max: e.total});
                            $('#status').empty().text(parseInt((e.loaded / e.total * 100)) + '%');
                        }
                    }, false);

                    return xhr;
                }.bind(this),
                success: function (data) {
                    this.setState({
                        data: JSON.parse(data)
                    });
                    $('#status').empty().text('Successfully loaded!');
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.API_URL, status, err.toString());
                }.bind(this),
                cache: false,
                contentType: false,
                processData: false
            });
        } else {
            $('#status').empty().text('Please choose the file.');
        }
    }
    change(e){
        this.setState({link: e.target.value});
    }

    render() {
        var self = this,
        data = this.state.data,
        showListOfFiles = data.length > 0 ? '' : 'you have no any files yet..',
        files = data.map(function(file, index) {
            return (<File key={index} file={file}/>);
        });


        return (
            <div>
            <div className="title">Available Files</div>
            <div>{showListOfFiles}</div>
            <div>{files}</div>
            <form id="uploadForm" className="form-padded" encType="multipart/form-data" onSubmit={this.handleFile.bind(this)}>
            <input type="file" name="userFile"/>
            <input type="submit" value="Upload File" name="submit"/>
            </form>

            <br/>
            <hr/>
            <h1>Upload File from URL</h1>

            <form id="uploadfileUrl" className="form-padded" encType="multipart/form-data" onSubmit={this.handleFileFromURL.bind(this)}>
            <input onChange={this.change.bind(this)} type="text" name="file"/>
            <input type="submit" value="Upload File" name="submit"/>
            </form>

            <progress></progress>
            <span id="status" className="status-percentage"></span>
            </div>
        );
    }
}

class App extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
            <FilesList {...this.props} API_URL={this.props.API_URL}/>
            </div>
        )
    }
}
export default App;
