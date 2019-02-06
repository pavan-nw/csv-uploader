package com.app.demo.csvuploader.controller;

import com.app.demo.csvuploader.ModelPojo.EcommerceModel;
import com.app.demo.csvuploader.fakedatastore.FakeDataStoreService;
import com.app.demo.csvuploader.service.FileStorageService;
import com.app.demo.csvuploader.utils.CsvReaderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private CsvReaderService csvReaderService;
    @Autowired
    private FakeDataStoreService fakeDataStoreService;

    @PostMapping(path = "/uploadCSV", produces=MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin
    public ResponseEntity<List<EcommerceModel>> uploadCSV(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();

        //get object lists from csv file
        List<EcommerceModel> models = csvReaderService.parseCSVFile(fileStorageService.getFileStorageLocation().resolve(fileName).toString());

        // store the file data to in memory data store
        fakeDataStoreService.setStoredModels(models);

        return new ResponseEntity(fakeDataStoreService.getStoredModels(), HttpStatus.OK);
    }

    @GetMapping(path = "/getAllData", produces=MediaType.APPLICATION_JSON_VALUE)
    //@ResponseBody
    public ResponseEntity<List<EcommerceModel>> getAllEcommerceData(){
        return new ResponseEntity(fakeDataStoreService.getStoredModels(), HttpStatus.OK);
    }

}
