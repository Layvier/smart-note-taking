from aiohttp import web
from aiohttp_validate import validate
from similarity import get_relevant_paragraphs


PORT= 4203


@validate(
    request_schema={
        "type": "object",
        "properties": {
            "input_text": {"type": "string"},
            "source_documents": {
                "type": "array", 
                "items": {
                    "type": "string"
                }
            },
            "similarity_treshold": {"type": "number"},
            "max_contexts_per_document": {"type": "number"}
        },
        "required": ["input_text", "source_documents"],
        "additionalProperties": False
    },
    response_schema={
        "type": "object",
        "properties": {
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "similarity": {"type": "number"},
                        "context": {"type": "string"},
                        "document_index": {"type": "number"},
                        "character_index": {"type": "number"},
                    },
                    "required": ["similarity", "context"],
                }
            }
        },
        "required": ["items"],
        "additionalProperties": False   
    }
)
async def get_relevant_contexts_handler(body, request):
    contexts = get_relevant_paragraphs(body['input_text'], body['source_documents'], 
                                       similarity_treshold=body.get('similarity_treshold', 0.3), 
                                       max_contexts_per_document=body.get('max_contexts_per_document', 3))
    return {
        'items': contexts
    }
    

serverApp = web.Application()
serverApp.add_routes([
    web.post('/api/relevant_contexts', get_relevant_contexts_handler)])

def start_server():
    web.run_app(serverApp, port=PORT);