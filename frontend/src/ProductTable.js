import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import {ProgressSpinner} from 'primereact/progressspinner';
import axios from 'axios';

class Products extends Component {

    constructor() {
        super();
        this.state = {
            txns: [],
            tableStyle: {
                display: 'none'
            },
            spinnerStyle: {
                display: 'none'
            }
        };
        this.onUploadClick = this.onUploadClick.bind(this);
    }

    onUploadClick(event) {
        this.setState({ spinnerStyle: { display: 'block' } });
        console.log(event);
        var formData = new FormData();
        var csvFile = document.querySelector('#file');
        formData.append("file", csvFile.files[0]);
        // axios.post('/uploadCSV', formData, {
        axios.post('http://localhost:8095/uploadCSV', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 300000
        }).then(resp => {
            console.log(resp);
            if (Array.isArray(resp.data)) {
                this.setState({ txns: resp.data, tableStyle: { display: 'block' }, spinnerStyle: { display: 'none' } });
            }
        }).catch(err => {console.log(err);
            this.setState({ spinnerStyle: { display: 'none' } });
        });
    }

    render() {

        const header = <div style={{ 'textAlign': 'left' }}>
            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="50" />
        </div>;

        return (
            <div className="container-fluid">
                <div >
                    <h1>E-Commerce Products</h1>
                    <div  >
                        <input type="file" name="file" id="file" />
                        <Button label="Upload CSV" className="p-button-raised"
                            onClick={this.onUploadClick} />
                        <br />
                        <p>*** For larger size CSV file, time taken will be more if your connection is on low speed. </p>
                    </div>
                </div>
                <br/>
                <ProgressSpinner style={this.state.spinnerStyle}/>
                <div className='row'>
                    <div className='col-sm-12'>
                        <Card style={this.state.tableStyle}>
                            <div className="content-section implementation">
                                <DataTable value={this.state.txns} paginator={true}
                                    rows={50} responsive={true} sortMode="multiple"
                                    header={header}
                                    globalFilter={this.state.globalFilter}>
                                    <Column key='productName' style={{width:'250px'}} field='productName' header='Product Name' filter={true} />
                                    <Column key='retailPrice' style={{width:'150px'}} field='retailPrice' header='Retail Price' sortable filter={true} />
                                    <Column key='discountedPrice' style={{width:'180px'}} field='discountedPrice' header='Discounted Price' sortable filter={true} />
                                    <Column key='description' field='description' header='Description' filter={true} />
                                    <Column key='brand' style={{width:'150px'}} field='brand' header='Brand' filter={true} />
                                </DataTable>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

export default Products;
