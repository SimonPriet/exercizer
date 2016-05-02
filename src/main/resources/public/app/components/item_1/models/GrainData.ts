interface GrainData {
    title: string,
    max_score: number,
    statement: string,
    document_list: IDocument[];
    hint: string,
    answer_explanation: string,
    custom_data: {
        available_anwser_list:any[],
        correct_answer_list:any[]
    };
}