import {Injectable} from "@nestjs/common";

@Injectable()
export class FilesService {
    getFiles(){
        const data = {
            items: [
                {
                    id: '1',
                    name: 'Documents',
                    children: [
                        {
                            id: '1-1',
                            name: `$'s Reports`,
                            children: [
                                {
                                    id: '1-1-1',
                                    name: '2023_Q1_Report.pdf',
                                    type: 'file',
                                },
                                {
                                    id: '1-1-2',
                                    name: '2023_Q2_Report.pdf',
                                    type: 'file',
                                },
                            ],
                        },
                        {
                            id: '1-2',
                            name: 'Invoices',
                            children: [
                                {
                                    id: '1-2-1',
                                    name: 'Invoice_001.pdf',
                                    type: 'file',
                                },
                                {
                                    id: '1-2-2',
                                    name: 'Invoice_002.pdf',
                                    type: 'file',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: '2',
                    name: 'Photos',
                    children: [
                        {
                            id: '2-1',
                            name: 'Vacations',
                            children: [
                                {
                                    id: '2-1-1',
                                    name: 'Beach.jpg',
                                    type: 'file',
                                },
                                {
                                    id: '2-1-2',
                                    name: 'Mountain.jpg',
                                    type: 'file',
                                },
                            ],
                        },
                        {
                            id: '2-2',
                            name: 'Family',
                            children: [
                                {
                                    id: '2-2-1',
                                    name: 'Birthday.jpg',
                                    type: 'file',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: '3',
                    name: 'Music',
                    children: [
                        {
                            id: '3-1',
                            name: 'Pop',
                            children: [
                                {
                                    id: '3-1-1',
                                    name: 'Hit_Song.mp3',
                                    type: 'file',
                                },
                            ],
                        },
                        {
                            id: '3-2',
                            name: 'Classical',
                            children: [
                                {
                                    id: '3-2-1',
                                    name: 'Symphony_No_5.mp3',
                                    type: 'file',
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        return {
            status: 'success',
            message: 'Files successfully',
            data,
        };
    }

}
