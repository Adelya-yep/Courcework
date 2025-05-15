import React from 'react';
import FeedbackForm from '../components/FeedbackForm';
import { Container, Row, Col, Card } from 'react-bootstrap';

const SupportPage = () => {
    return (
        <Container fluid="md" className="support-page py-4 py-md-5">
            <Row className="justify-content-center">
                <Col xs={12} xl={10} xxl={8} className="px-3 px-sm-4">
                    <Card className="shadow-sm">
                        <Card.Body className="p-4 p-md-5">
                            <div className="text-center mb-4 mb-md-5">
                                <h2 className="mb-3">Обратная связь</h2>
                                <p className="text-muted mb-0">
                                    Оставьте ваше сообщение, и мы свяжемся с вами!
                                </p>
                            </div>
                            <div className="mx-auto" style={{ maxWidth: '800px' }}>
                                <FeedbackForm />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SupportPage;